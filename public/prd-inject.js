/**
 * PRD 注入脚本 - Vanilla JS 实现，适配所有前端框架
 * 功能：段落双击编辑 / 折叠标题 / Mermaid / 版本徽章 / 未保存提示
 * 支持双模式：静态读取（无需服务）+ API 模式（支持编辑）
 * 自动更新：每次加载检查远程版本，有更新时提示刷新
 */
(function() {
  if (window.__PRD_INJECTED__) return;
  window.__PRD_INJECTED__ = true;

  const PRD_PORT = window.__PRD_PORT__ || 3004;
  const PRD_BASE = `http://localhost:${PRD_PORT}`;

  // ── 版本检查与自动更新 ───────────────────────────────
  const SCRIPT_VERSION = '1.1.0'; // 与 skills/prd-inject.js 同步更新

  async function checkAndUpdate() {
    try {
      const r = await fetch(PRD_BASE + '/api/prd/version');
      if (!r.ok) return;
      const { version } = await r.json();
      if (version && version !== SCRIPT_VERSION) {
        // 版本不同，尝试自动更新
        const scriptR = await fetch(PRD_BASE + '/api/prd/script');
        if (scriptR.ok) {
          const scriptContent = await scriptR.text();
          if (scriptContent && scriptContent.includes('__PRD_INJECTED__')) {
            // 移除旧样式
            document.getElementById('__prd-styles__')?.remove();
            // 执行新脚本
            eval(scriptContent);
            // 重新创建按钮
            createFloatBtn();
            showToast('PRD 脚本已自动更新，请刷新或继续使用');
            return;
          }
        }
        // 自动更新失败，显示提示
        showUpdateBanner(version);
      }
    } catch {}
  }

  function showUpdateBanner(remoteVersion) {
    const banner = document.createElement('div');
    banner.id = '__prd-update-banner__';
    banner.innerHTML = `
      <span>PRD 脚本有新版本 (v${remoteVersion})</span>
      <button onclick="location.reload()">刷新页面</button>
      <style>
        #__prd-update-banner__{
          position:fixed;bottom:70px;left:24px;z-index:99999;
          background:linear-gradient(135deg,#ff6b6b,#ee5a5a);
          color:#fff;padding:10px 16px;border-radius:8px;
          font-size:13px;display:flex;align-items:center;gap:10px;
          box-shadow:0 4px 12px rgba(238,90,90,0.4);
          animation:__prd-slide-up 0.3s ease;
        }
        @keyframes __prd-slide-up{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        #__prd-update-banner__ button{
          background:#fff;color:#ee5a5a;border:none;padding:4px 12px;
          border-radius:4px;font-size:12px;cursor:pointer;font-weight:600;
        }
        #__prd-update-banner__ button:hover{background:#ffeaea}
      </style>
    `;
    document.body.appendChild(banner);
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.id = '__prd-toast__';
    toast.textContent = msg;
    toast.style.cssText = `
      position:fixed;top:80px;right:24px;z-index:99999;
      background:linear-gradient(135deg,#667eea,#764ba2);
      color:#fff;padding:12px 20px;border-radius:8px;
      font-size:13px;box-shadow:0 4px 12px rgba(102,126,234,0.4);
      animation:__prd-toast-in 0.3s ease;
    `;
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        @keyframes __prd-toast-in{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
      </style>
    `);
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }

  // 启动时检查更新（非阻塞）
  checkAndUpdate();

  // ── 状态 ─────────────────────────────────────────────
  let panelOpen = false;
  let panelEl = null;
  let stylesInjected = false;
  let currentRoute = null;
  let currentMarkdown = '';
  let originalMarkdown = '';
  let editingLineIdx = null;
  let editingLineIdxRef = null;
  let apiMode = false;          // 是否使用 API 模式（有服务）
  let editMode = false;         // 编辑模式（API 专属）
  let staticMode = false;       // 静态模式提示

  // ── 路由识别 ───────────────────────────────────────────
  function getCurrentRoute() {
    const meta = document.querySelector('meta[name="prd-route"]');
    if (meta) return meta.content;
    const parts = window.location.pathname.split('/').filter(Boolean);
    for (let i = parts.length - 1; i >= 0; i--) {
      if (!/^\d+$/.test(parts[i])) {
        // 解码 URL 编码的路由（如中文路径）
        try {
          return decodeURIComponent(parts[i]);
        } catch {
          return parts[i];
        }
      }
    }
    return parts[parts.length - 1] || 'index';
  }

  // ── 静态读取 PRD（无需服务）────────────────────────────
  async function loadPRDStatic(route) {
    // 对路由进行 URL 编码，用于文件路径
    const encodedRoute = encodeURIComponent(route);
    const mdPaths = [
      `.prd/_routes/_${encodedRoute}.md`,
      `.prd/_routes/_${route}.md`,
      `public/prd/_routes/_${encodedRoute}.md`,
      `public/prd/_routes/_${route}.md`,
      `.prd/_routes/_index.md`,
      `public/prd/_routes/_index.md`,
    ];
    for (const mdPath of mdPaths) {
      try {
        const r = await fetch(mdPath + '?t=' + Date.now(), { cache: 'no-store' });
        if (r.ok) {
          return { content: await r.text(), source: mdPath, mode: 'static' };
        }
      } catch {}
    }
    return { content: '', source: null, mode: 'static' };
  }

  // ── API 模式加载 PRD ───────────────────────────────────
  async function loadPRDApi(route) {
    try {
      const r = await fetch(PRD_BASE + '/api/prd/read?route=' + encodeURIComponent(route));
      if (r.ok) {
        const text = await r.text();
        // 尝试解析 JSON，如果失败则直接使用纯文本
        try {
          const d = JSON.parse(text);
          return { content: d.content || '', source: 'api', mode: 'api' };
        } catch {
          // API 直接返回 Markdown 文本
          return { content: text, source: 'api', mode: 'api' };
        }
      }
    } catch {}
    return { content: '', source: null, mode: 'api' };
  }

  // ── 加载 PRD（双模式）─────────────────────────────────
  async function loadPRD(route) {
    currentRoute = route;
    apiMode = false;
    staticMode = false;

    // 优先尝试 API 模式
    let result = await loadPRDApi(route);
    if (result.content) {
      apiMode = true;
    } else {
      // API 失败，降级到静态读取
      result = await loadPRDStatic(route);
      if (result.content) {
        staticMode = true;
      }
    }

    currentMarkdown = result.content || '';
    originalMarkdown = currentMarkdown;
    renderView(route, result.source);
  }

  // ── 样式注入 ───────────────────────────────────────────
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    const s = document.createElement('style');
    s.id = '__prd-styles__';
    s.textContent = [
      '.__prd-panel__{',
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
        'position:fixed;top:0;right:0;width:min(560px,100vw);height:100vh;',
        'background:rgba(255,255,255,0.82);box-shadow:-4px 0 20px rgba(0,0,0,0.1);',
        'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
        'z-index:99998;display:flex;flex-direction:column;',
        'transform:translateX(100%);transition:transform 0.3s ease;',
      '}',
      '.__prd-panel__.__open__{transform:translateX(0)}',
      '@media (max-width:560px){.__prd-panel__{width:100vw}}',
      '.__prd-body__{flex:1;overflow:hidden;display:flex;flex-direction:column}',
      '.__prd-content__{padding:24px;overflow-y:auto;flex:1;min-height:0}',

      '.__prd-header__{',
        'display:flex;justify-content:space-between;align-items:flex-start;',
        'padding:16px 20px;background:linear-gradient(135deg,#f5f7fa,#e4e8ec);',
        'border-bottom:1px solid #e5e7eb;flex-shrink:0;',
      '}',
      '.__prd-title__{display:flex;flex-direction:column;gap:6px}',
      '.__prd-title__ h3{margin:0;font-size:16px;font-weight:600;color:#1a1a2e;line-height:1.4}',
      '.__prd-meta__{display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
      '.__prd-ver__{padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600;background:#e8eaf6;color:#3949ab}',
      '.__prd-dot__{width:8px;height:8px;border-radius:50%;background:#f59e0b;animation:__prd-pulse 1.5s infinite}',
      '@keyframes __prd-pulse{0%,100%{opacity:1}50%{opacity:0.5}}',
      '.__prd-actions__{display:flex;gap:8px;align-items:center}',

      '.__prd-btn__{padding:6px 14px;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all 0.15s}',
      '.__prd-btn__:disabled{opacity:0.5;cursor:not-allowed}',
      '.__prd-btn-pri__{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff}',
      '.__prd-btn-pri__:hover:not(:disabled){box-shadow:0 2px 8px rgba(102,126,234,0.4)}',
      '.__prd-btn-sec__{background:#fff;color:#4a5568;border:1px solid #e2e8f0}',
      '.__prd-btn-sec__:hover:not(:disabled){background:#f7fafc;border-color:#cbd5e0}',
      '.__prd-btn-close__{background:none;border:none;font-size:18px;color:#718096;cursor:pointer;padding:4px 8px;border-radius:4px;margin-left:4px}',
      '.__prd-btn-close__:hover{background:rgba(0,0,0,0.05);color:#2d3748}',

      '.__prd-error__{padding:10px 20px;background:#fed7d7;color:#c53030;font-size:13px;border-bottom:1px solid #feb2b2}',
      '.__prd-loading__{padding:60px 20px;text-align:center;color:#718096}',
      '.__prd-mode-badge__{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}',
      '.__prd-mode-badge__.api{background:#d1fae5;color:#065f46}',
      '.__prd-mode-badge__.static{background:#fef3c7;color:#92400e}',

      '.__prd-heading-wrapper__{margin-bottom:4px}',
      '.prd-title-text{flex:1;display:flex;align-items:center}',

      '.prd-h1-header{display:flex;align-items:center}',
      '.prd-h1-title{font-size:24px;font-weight:700;color:#1a1a2e;margin:0;padding:12px 0 10px;letter-spacing:1px}',
      '.prd-h1-line{height:3px;background:linear-gradient(90deg,#667eea,#764ba2);margin-bottom:20px;border-radius:2px}',
      '.prd-h2-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:4px 0;border-radius:4px}',
      '.prd-h2-header:hover{background:rgba(102,126,234,0.08)}',
      '.prd-h2-header:hover .__prd-collapse-icon__{background:#667eea;color:#fff}',
      '.prd-h2-title{font-size:20px;font-weight:700;color:#2d3748;margin:0;padding:14px 0 8px}',
      '.prd-h2-line{height:2px;background:#667eea;margin-bottom:16px}',
      '.prd-h3-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:4px 0;border-radius:4px}',
      '.prd-h3-header:hover{background:rgba(102,126,234,0.08)}',
      '.prd-h3-header:hover .__prd-collapse-icon__{background:#667eea;color:#fff}',
      '.prd-h3-title{font-size:17px;font-weight:600;color:#1a1a2e;margin:0;padding:12px 0 6px}',
      '.prd-h3-line{height:1px;background:#667eea;margin-bottom:12px;opacity:0.6}',
      '.prd-h4-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:4px 0}',
      '.prd-h4-title{font-size:15px;font-weight:600;color:#1a1a2e;margin:0;padding:10px 0 6px}',
      '.prd-h4-line{height:1px;background:#a0aec0;margin-bottom:10px}',
      '.prd-h5-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:4px 0}',
      '.prd-h5-title{font-size:14px;font-weight:600;color:#1a1a2e;margin:0;padding:8px 0 4px}',
      '.prd-h5-line{height:1px;background:#cbd5e0;margin-bottom:8px}',
      '.prd-h6-header{display:flex;align-items:center;justify-content:space-between;cursor:pointer;user-select:none;padding:4px 0}',
      '.prd-h6-title{font-size:13px;font-weight:600;color:#1a1a2e;margin:0;padding:6px 0 4px}',
      '.prd-h6-line{height:1px;background:#e2e8f0;margin-bottom:6px}',
      '.__prd-collapse-icon__{font-size:10px;color:#667eea;background:transparent;border-radius:3px;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:8px;transition:all 0.15s}',

      '.__prd-p__{color:#2d3748;line-height:1.8;margin:0 0 14px}',
      '.__prd-ul_,.__prd-ol__{color:#2d3748;margin:0 0 14px;padding-left:24px}',
      '.__prd-li__{margin:6px 0;line-height:1.7}',
      '.__prd-block__{cursor:text;border-radius:4px;transition:background 0.15s;margin-bottom:4px}',
      '.__prd-block__:hover{background:rgba(102,126,234,0.05)}',

      '.__prd-twrap__{overflow-x:auto;margin:16px 0;border-radius:8px;border:1px solid #e2e8f0}',
      '.__prd-tbl__{width:100%;border-collapse:collapse;font-size:13px}',
      '.__prd-tbl__ th,.__prd-tbl__ td{padding:10px 12px;border-bottom:1px solid #e2e8f0;text-align:left}',
      '.__prd-tbl__ th{background:linear-gradient(135deg,#f5f7fa,#edf2f7);font-weight:600;color:#1a1a2e}',
      '.__prd-tbl__ td{color:#2d3748}',
      '.__prd-tbl__ tr:last-child td{border-bottom:none}',
      '.__prd-tbl__ tr:nth-child(even){background:#fafbfc}',

      '.__prd-code__{background:#edf2f7;padding:2px 6px;border-radius:4px;font-size:13px;color:#667eea;font-family:monospace}',
      '.__prd-pre__{background:#1a1a2e;padding:16px;border-radius:8px;overflow-x:auto;margin:16px 0}',
      '.__prd-pre__ code{color:#e2e8f0;font-size:13px;line-height:1.5}',
      '.__prd-cb__{margin-right:8px;accent-color:#667eea}',

      '.__prd-hr__{border:none;border-top:1px solid #e2e8f0;margin:24px 0}',

      '.__prd-mermaid__{background:rgba(255,255,255,0.9);padding:16px;border-radius:8px;border:1px solid #e2e8f0;margin:16px 0;overflow-x:auto;text-align:center}',
      '.__prd-mermaid__ svg{max-width:100%;height:auto}',
      '.__prd-merr__{color:#c53030;background:#fed7d7;padding:12px;border-radius:6px;margin:12px 0;font-size:13px}',

      '.__prd-ta__{flex:1;border:none;resize:none;padding:20px;font-family:"Monaco","Menlo","Ubuntu Mono",monospace;font-size:14px;line-height:1.6;outline:none;box-sizing:background:#fafafa;color:#2d3748;overflow-y:auto}',
      '.__prd-ta__:focus{background:#fff}',

      '.__prd-inline-ta__{width:100%;min-height:120px;padding:14px 16px;border:2px solid #667eea;border-radius:6px;font-family:"Monaco","Menlo","Ubuntu Mono",monospace;font-size:14px;line-height:1.6;resize:vertical;outline:none;box-sizing:border-box;background:#fff;color:#2d3748;box-shadow:0 0 0 3px rgba(102,126,234,0.15)}',
      '.__prd-inline-actions__{display:flex;justify-content:flex-end;gap:8px;margin-top:10px;margin-bottom:4px}',

      '.__prd-static-hint__{background:#fef3c7;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;color:#92400e;border:1px solid #fcd34d}',
      '.__prd-static-hint__ strong{color:#b45309}',
      '.__prd-static-hint__ a{color:#b45309;font-weight:600}',
    ].join('');
    document.head.appendChild(s);
  }

  // ── 面板创建 ───────────────────────────────────────────
  function createPanel() {
    injectStyles();
    panelEl = document.createElement('div');
    panelEl.className = '__prd-panel__';
    document.body.appendChild(panelEl);
    return panelEl;
  }

  // ── 悬浮按钮 ───────────────────────────────────────────
  function createFloatBtn() {
    const btn = document.createElement('button');
    btn.id = '__prd-btn__';
    btn.textContent = 'PRD';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '24px', left: '24px', padding: '8px 16px',
      borderRadius: '6px', background: '#667eea', color: '#fff', border: 'none',
      cursor: 'pointer', fontSize: '13px', fontWeight: '500',
      boxShadow: '0 2px 8px rgba(102,126,234,0.3)', zIndex: '99999', transition: 'all 0.2s',
    });
    btn.onmouseover = () => { btn.style.background = '#764ba2'; btn.style.boxShadow = '0 4px 12px rgba(102,126,234,0.5)'; };
    btn.onmouseout = () => { btn.style.background = '#667eea'; btn.style.boxShadow = '0 2px 8px rgba(102,126,234,0.3)'; };
    btn.onclick = togglePanel;
    document.body.appendChild(btn);
  }

  // ── 切换面板 ───────────────────────────────────────────
  function togglePanel() {
    panelOpen = !panelOpen;
    if (!panelEl) panelEl = createPanel();
    panelEl.classList.toggle('__open__', panelOpen);
    if (panelOpen) {
      const route = getCurrentRoute();
      if (route !== currentRoute || !currentMarkdown) {
        currentRoute = route;
        loadPRD(route);
      }
    }
  }

  // ── 核心：Markdown → 树形节点解析 ─────────────────────
  function parseTree(lines, startIdx, parentLevel) {
    const nodes = [];
    let i = startIdx;
    while (i < lines.length) {
      const line = lines[i];
      const hMatch = line.match(/^(#{1,10})\s+(.+)$/);
      if (hMatch) {
        const level = hMatch[1].length;
        if (level <= parentLevel && parentLevel > 0) break;
        const { nodes: children, endIdx } = parseTree(lines, i + 1, level);
        const rawLines = [];
        for (let k = i + 1; k < endIdx; k++) rawLines.push(lines[k]);
        nodes.push({ type: 'heading', level, text: hMatch[2], lineIdx: i, children, raw: rawLines.join('\n') });
        i = endIdx;
      } else if (line.trim()) {
        let blockLines = [line];
        let j = i + 1;
        while (j < lines.length) {
          const nl = lines[j];
          if (nl.match(/^(#{1,10})\s/)) break;
          if (nl.trim()) blockLines.push(nl);
          j++;
        }
        nodes.push({ type: 'content', raw: blockLines.join('\n'), lineIdx: i, children: [] });
        i = j;
      } else {
        i++;
      }
    }
    return { nodes, endIdx: i };
  }

  // ── 工具 ───────────────────────────────────────────────
  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── 表格渲染 ───────────────────────────────────────────
  function renderTables(text) {
    const lines = text.split('\n');
    const result = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|') && line.includes('|', 1)) {
        if (i + 1 < lines.length) {
          const next = lines[i + 1].trim();
          const sepContent = next.replace(/^\||\|$/g, '').trim();
          const isSep = sepContent !== '' && /^[:\-\s|]+$/.test(sepContent);
          if (isSep) {
            const headerLine = line;
            const dataLines = [];
            let j = i + 2;
            while (j < lines.length) {
              const dl = lines[j].trim();
              if (dl.startsWith('|') && dl.endsWith('|') && dl.includes('|', 1)) {
                const content = dl.replace(/^\||\|$/g, '').trim();
                const nextOfDl = j + 1 < lines.length ? lines[j + 1].trim() : '';
                const nextSepContent = nextOfDl.replace(/^\||\|$/g, '').trim();
                const isNextSep = nextSepContent !== '' && /^[:\-\s|]+$/.test(nextSepContent);
                const isSepItself = content !== '' && /^[:\-\s|]+$/.test(content);
                if (isNextSep || isSepItself) break;
                dataLines.push(dl);
                j++;
              } else {
                break;
              }
            }
            const ths = headerLine.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
            const rows = dataLines.map(row =>
              '<tr>' + row.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
            ).join('');
            result.push(`<div class="__prd-twrap__"><table class="__prd-tbl__"><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table></div>`);
            i = j;
            continue;
          }
        }
      }
      result.push(lines[i]);
      i++;
    }
    return result.join('\n');
  }

  // ── 列表渲染 ───────────────────────────────────────────
  function renderLists(text) {
    text = text.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>[\s\S]*?<\/li>)\n(?=<li>)/g, '$1');
    text = text.replace(/<li>([\s\S]*?)<\/li>/g, (_, inner) => {
      if (inner.includes('<ul') || inner.includes('<ol')) return `<li>${inner}</li>`;
      return `<ul class="__prd-ul__"><li>${inner}</li></ul>`;
    });
    text = text.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
    text = text.replace(/(<li>[\s\S]*?<\/li>)\n(?=<li>)/g, '$1');
    text = text.replace(/<li>([\s\S]*?)<\/li>/g, (_, inner) => {
      if (inner.includes('<ul') || inner.includes('<ol')) return `<li>${inner}</li>`;
      return `<ol class="__prd-ol__"><li>${inner}</li></ol>`;
    });
    return text;
  }

  // ── 内联格式化 ─────────────────────────────────────────
  function inlineFmt(text) {
    return text
      .replace(/`([^`]+)`/g, '<code class="__prd-code__">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[ \]/g, '<input type="checkbox" class="__prd-cb__">')
      .replace(/\[x\]/gi, '<input type="checkbox" class="__prd-cb__" checked>');
  }

  // ── 渲染单行内容 ───────────────────────────────────────
  function renderInline(text) {
    return inlineFmt(text).replace(/\n/g, '<br>');
  }

  // ── 渲染内容块 ─────────────────────────────────────────
  function mdBlock(raw) {
    let html = raw;
    html = html.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) =>
      `<div class="__prd-mermaid__" data-code="${encodeURIComponent(code.trim())}"></div>`);
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _l, code) =>
      `<pre class="__prd-pre__"><code>${escHtml(code.trim())}</code></pre>`);
    html = html.replace(/^---$/gm, '<hr class="__prd-hr__">');
    html = renderTables(html);
    html = renderLists(html);
    html = inlineFmt(html).replace(/\n/g, '<br>');

    const lines = html.split('\n');
    let result = '';
    let buffer = '';
    const flushBuffer = () => {
      if (buffer) result += `<p class="__prd-p__">${buffer}</p>`;
      buffer = '';
    };
    for (const line of lines) {
      const isBlockTag = /^</.test(line.trim());
      if (isBlockTag) {
        flushBuffer();
        result += line + '\n';
      } else {
        if (buffer) buffer += '<br>';
        buffer += line;
      }
    }
    flushBuffer();
    result = result.replace(/<p class="__prd-p__"><br><\/p>/g, '');
    result = result.replace(/<br><\/p>/g, '</p>');
    return result;
  }

  // ── 渲染节点树 → HTML ─────────────────────────────────
  function renderNodes(nodes) {
    let html = '';
    nodes.forEach(node => {
      if (node.type === 'heading') {
        const lvl = node.level;
        const lc = `prd-h${lvl}`;
        const isCollapsible = lvl > 1;
        if (isCollapsible) {
          const inner = node.children && node.children.length ? renderNodes(node.children) : '';
          html += `<div class="__prd-heading-wrapper__ ${lc}-wrapper">
  <div class="${lc}-header" onclick="__prd_toggle(this)">
    <div class="prd-title-text"><h${lvl} class="${lc}-title">${node.text}</h${lvl}></div>
    <span class="__prd-collapse-icon__">▼</span>
  </div>
  <div class="${lc}-line"></div>
  <div class="${lc}-content">${inner}</div>
</div>`;
        } else {
          const inner = node.children && node.children.length ? renderNodes(node.children) : '';
          html += `<div class="__prd-heading-wrapper__ ${lc}-wrapper">
  <div class="${lc}-header">
    <div class="prd-title-text"><h1 class="${lc}-title">${node.text}</h1></div>
  </div>
  <div class="${lc}-line"></div>
  <div class="${lc}-content">${inner}</div>
</div>`;
        }
      } else if (node.type === 'content' && node.raw) {
        // 静态模式下禁用双击编辑
        const dblClick = apiMode ? `ondblclick="__prd_edit_block(${node.lineIdx})"` : '';
        html += `<div class="__prd-block__" data-line="${node.lineIdx}" ${dblClick}>${mdBlock(node.raw)}</div>`;
      }
    });
    return html;
  }

  // ── 全局：折叠切换 ────────────────────────────────────
  window.__prd_toggle = function(el) {
    const wrapper = el.closest('.__prd-heading-wrapper__');
    if (!wrapper) return;
    const levelCls = Array.from(wrapper.classList).find(c => /^prd-h\d-wrapper$/.test(c))?.replace('-wrapper', '');
    const content = levelCls ? wrapper.querySelector('.' + levelCls + '-content') : null;
    const icon = el.querySelector('.__prd-collapse-icon__');
    const isCollapsed = el.classList.contains('__collapsed__');
    if (isCollapsed) {
      el.classList.remove('__collapsed__');
      if (icon) icon.textContent = '▼';
      if (content) content.style.display = '';
    } else {
      el.classList.add('__collapsed__');
      if (icon) icon.textContent = '▶';
      if (content) content.style.display = 'none';
    }
  };

  // ── 全局：双击段落编辑 ────────────────────────────────
  window.__prd_edit_block = function(lineIdx) {
    if (!apiMode) return;
    const blockEl = document.querySelector(`.__prd-block__[data-line="${lineIdx}"]`);
    if (!blockEl) return;
    const lines = currentMarkdown.split('\n');
    let endIdx = lineIdx + 1;
    while (endIdx < lines.length && !lines[endIdx].match(/^#{1,10}\s/)) endIdx++;
    const raw = lines.slice(lineIdx, endIdx).join('\n');
    editingLineIdx = lineIdx;
    editingLineIdxRef = lineIdx;
    blockEl.dataset.orig = blockEl.innerHTML;
    blockEl.style.cssText = 'margin-bottom:8px';
    blockEl.innerHTML = [
      `<textarea id="__prd_inline_ta__" class="__prd-inline-ta__">${escHtml(raw)}</textarea>`,
      '<div class="__prd-inline-actions__">',
        '<button class="__prd-btn__ __prd-btn-sec__" id="__prd_inline_cancel__">取消</button>',
        '<button class="__prd-btn__ __prd-btn-pri__" id="__prd_inline_save__">保存</button>',
      '</div>',
    ].join('');
    const ta = document.getElementById('__prd_inline_ta__');
    ta.focus();
    ta.select();
    document.getElementById('__prd_inline_cancel__').onclick = () => {
      blockEl.innerHTML = blockEl.dataset.orig;
      blockEl.style.cssText = '';
      editingLineIdx = null;
      editingLineIdxRef = null;
    };
    document.getElementById('__prd_inline_save__').onclick = () => saveBlockInline(lineIdx, blockEl);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.getElementById('__prd_inline_cancel__').click();
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') document.getElementById('__prd_inline_save__').click();
    });
  };

  async function saveBlockInline(lineIdx, blockEl) {
    const ta = document.getElementById('__prd_inline_ta__');
    if (!ta) return;
    const newText = ta.value;
    const lines = currentMarkdown.split('\n');
    let endIdx = lineIdx + 1;
    while (endIdx < lines.length && !lines[endIdx].match(/^#{1,10}\s/)) endIdx++;
    const newLines = [...lines.slice(0, lineIdx), newText, ...lines.slice(endIdx)];
    const newMd = newLines.join('\n');
    currentMarkdown = newMd;
    originalMarkdown = newMd;
    editingLineIdx = null;
    editingLineIdxRef = null;
    renderView(currentRoute, 'api');
    try {
      const res = await fetch(PRD_BASE + '/api/prd/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: currentRoute, content: newMd }),
      });
      if (!res.ok) throw new Error();
    } catch {
      alert('保存失败，请检查 PRD 服务是否启动');
    }
  }

  // ── 空状态 / 提示 HTML ─────────────────────────────────
  function getEmptyHint(source, route) {
    if (!source) {
      return `<div style="padding:40px 24px;text-align:center;color:#718096">
        <div style="font-size:48px;margin-bottom:16px">📋</div>
        <h3 style="margin:0 0 8px;color:#4a5568">暂无 PRD 文档</h3>
        <p style="margin:0 0 16px;font-size:14px">当前路由：<code style="background:#edf2f7;padding:2px 6px;border-radius:4px">${escHtml(route)}</code></p>
        <p style="margin:0;font-size:13px">运行 <code style="background:#edf2f7;padding:2px 6px;border-radius:4px">/prd</code> 启动服务后可在面板中创建文档</p>
      </div>`;
    }
    if (staticMode) {
      return `<div class="__prd-static-hint__">
        <strong>📖 查看模式</strong>（静态读取）<br/>
        此文档来自：<code>${escHtml(source)}</code><br/>
        <strong>双击编辑 / 保存</strong> 功能需要启动 PRD 服务。<br/>
        运行 <code>/prd</code> 即可开启完整功能。
      </div>`;
    }
    return '';
  }

  // ── 视图模式渲染 ───────────────────────────────────────
  function renderView(route, source) {
    if (!panelEl) return;
    const lines = currentMarkdown.split('\n');
    const { nodes } = parseTree(lines, 0, 0);
    const bodyHtml = renderNodes(nodes);
    const verMatch = currentMarkdown.match(/### v(\d+)/);
    const dateMatch = currentMarkdown.match(/### v\d+\s+-\s+(\d{4}[-/]\d{2}[-/]\d{2})/);
    const ver = verMatch ? verMatch[1] : '1';
    const date = dateMatch ? dateMatch[1] : '';
    const hasChanges = currentMarkdown !== originalMarkdown;
    const modeBadge = apiMode ? '<span class="__prd-mode-badge__ api">API</span>' : '<span class="__prd-mode-badge__ static">静态</span>';
    const editBtnLabel = apiMode ? '编辑' : '编辑(需服务)';
    const editBtnDisabled = !apiMode;

    panelEl.innerHTML = [
      '<div class="__prd-header__">',
        '<div class="__prd-title__">',
          '<h3>PRD: ' + escHtml(route) + '</h3>',
          `<div class="__prd-meta__">`,
            `<span class="__prd-ver__">v${ver}${date ? ' · ' + date : ''}</span>`,
            modeBadge,
            hasChanges ? '<span class="__prd-dot__" title="有未保存的修改"></span>' : '',
          '</div>',
        '</div>',
        '<div class="__prd-actions__">',
          `<button class="__prd-btn__ __prd-btn-pri__" id="__prd_edit_btn__" ${editBtnDisabled ? 'disabled title="需启动 PRD 服务"' : ''}>${editBtnLabel}</button>`,
          '<button class="__prd-btn__ __prd-btn-close__" id="__prd_close_btn__">✕</button>',
        '</div>',
      '</div>',
      '<div class="__prd-body__">',
        '<div class="__prd-content__" id="__prd_content__">',
          getEmptyHint(source, route),
          bodyHtml,
        '</div>',
      '</div>',
    ].join('');

    document.getElementById('__prd_edit_btn__').onclick = () => { if (apiMode) renderEdit(route); };
    document.getElementById('__prd_close_btn__').onclick = togglePanel;
    renderMermaid();
  }

  // ── 编辑模式渲染 ───────────────────────────────────────
  function renderEdit(route) {
    if (!panelEl || !apiMode) return;
    panelEl.innerHTML = [
      '<div class="__prd-header__">',
        '<div class="__prd-title__"><h3>PRD: ' + escHtml(route) + ' <span style="font-size:13px;color:#667eea">[编辑模式]</span></h3></div>',
        '<div class="__prd-actions__">',
          '<button class="__prd-btn__ __prd-btn-sec__" id="__prd_cancel_btn__">取消</button>',
          '<button class="__prd-btn__ __prd-btn-pri__" id="__prd_save_btn__">保存</button>',
          '<button class="__prd-btn__ __prd-btn-close__" id="__prd_close_btn__">✕</button>',
        '</div>',
      '</div>',
      '<div class="__prd-body__" style="overflow:hidden">',
        `<textarea class="__prd-ta__" id="__prd_ta__">${escHtml(currentMarkdown)}</textarea>`,
      '</div>',
    ].join('');

    const ta = document.getElementById('__prd_ta__');
    document.getElementById('__prd_cancel_btn__').onclick = () => { currentMarkdown = originalMarkdown; renderView(route, 'api'); };
    document.getElementById('__prd_save_btn__').onclick = async () => {
      currentMarkdown = ta.value;
      originalMarkdown = currentMarkdown;
      renderView(route, 'api');
      try {
        const res = await fetch(PRD_BASE + '/api/prd/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ route, content: currentMarkdown }),
        });
        if (!res.ok) throw new Error();
      } catch {
        alert('保存失败，请检查 PRD 服务是否启动');
      }
    };
    document.getElementById('__prd_close_btn__').onclick = togglePanel;
    ta.focus();
  }

  // ── Mermaid 渲染 ───────────────────────────────────────
  function renderMermaid() {
    const els = document.querySelectorAll('.__prd-mermaid__[data-code]');
    if (!els.length) return;
    if (!window.__mermaid__) {
      window.__mermaid__ = true;
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      s.onload = () => {
        window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
        setTimeout(doMermaid, 50);
      };
      s.onerror = () => {
        els.forEach(el => {
          el.outerHTML = `<div class="__prd-merr__">图表加载失败（网络错误）</div>`;
        });
      };
      document.head.appendChild(s);
    } else {
      setTimeout(doMermaid, 50);
    }

    function doMermaid() {
      document.querySelectorAll('.__prd-mermaid__[data-code]').forEach(el => {
        const code = decodeURIComponent(el.dataset.code || '');
        if (!code) return;
        const id = 'm-' + Math.random().toString(36).substr(2, 9);
        el.removeAttribute('data-code');
        window.mermaid.render(id, code).then(({ svg }) => {
          el.innerHTML = svg;
        }).catch(err => {
          el.outerHTML = `<div class="__prd-merr__">图表渲染失败: ${err.message || err}</div>`;
        });
      });
    }
  }

  // ── SPA 路由切换监听 ───────────────────────────────────
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      if (panelOpen) {
        currentRoute = getCurrentRoute();
        loadPRD(currentRoute);
      }
    }
  }, 400);

  createFloatBtn();
})();
