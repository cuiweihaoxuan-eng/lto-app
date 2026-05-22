import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import './prd.css';

// 初始化mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Arial, sans-serif',
  fontSize: 11,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis',
    nodeSpacing: 20,
    rankSpacing: 30,
    padding: 8,
  },
  gantt: { useMaxWidth: true },
  themeVariables: {
    background: '#ffffff',
    primaryColor: '#f8f9fa',
    primaryTextColor: '#333',
    primaryBorderColor: '#667eea',
    lineColor: '#667eea',
    secondaryColor: '#f0f0f0',
  },
});

interface PrdPanelProps {
  route: string;
  projectRoot?: string;
  apiBaseUrl?: string;
  basePath?: string;
  onSave?: (content: string) => Promise<boolean>;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface PrdState {
  content: string;
  originalContent: string;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  editingLineIdx: number | null;
  editingText: string;
}

// Mermaid图表渲染组件
const MermaidChart: React.FC<{ code: string }> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || !code.trim()) return;
    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
    mermaid.render(id, code.trim())
      .then(({ svg: renderedSvg }) => {
        setSvg(renderedSvg);
        setError(null);
      })
      .catch((err: any) => {
        console.error('[Mermaid] render error:', err?.message || err);
        setError('图表渲染失败: ' + (err?.message || String(err)));
      });
  }, [code]);

  if (error) {
    return <div className="prd-mermaid-error">{error}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="prd-mermaid"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      style={svg ? {} : { minHeight: 60 }}
    />
  );
};

// 解析markdown内容，构建可折叠的树形结构
interface ParsedNode {
  type: 'heading' | 'content';
  level?: number;
  text?: string;
  raw?: string;
  lineIdx: number; // 原始行号（内容块的唯一标识）
  children: ParsedNode[];
}

const parseToTree = (lines: string[], startIdx: number = 0, parentLevel: number = 0): { nodes: ParsedNode[]; endIdx: number } => {
  const nodes: ParsedNode[] = [];
  let i = startIdx;

  while (i < lines.length) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,10})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;

      if (level <= parentLevel && parentLevel > 0) {
        break;
      }

      const { endIdx, children, content } = parseToTree(lines, i + 1, level);
      nodes.push({
        type: 'heading',
        level,
        text: headingMatch[2],
        children,
        raw: content,
        lineIdx: i,
      });
      i = endIdx;
    } else if (line.trim()) {
      let content = line;
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        const nextMatch = nextLine.match(/^(#{1,10})\s+(.+)$/);
        if (nextMatch && nextMatch[1].length <= parentLevel && parentLevel > 0) {
          break;
        }
        if (nextMatch) break;
        content += '\n' + nextLine;
        j++;
      }
      nodes.push({
        type: 'content',
        raw: content,
        children: [],
        lineIdx: i, // 内容块用起始行号作为唯一标识
      });
      i = j;
    } else {
      i++;
    }
  }

  let rawContent = '';
  for (let k = startIdx; k < i && k < lines.length; k++) {
    if (rawContent) rawContent += '\n';
    rawContent += lines[k];
  }

  return { nodes, endIdx: i, children: nodes, content: rawContent };
};

// 渲染解析后的节点树（简化版：去掉所有编辑状态逻辑）
const renderNodes = (
  nodes: ParsedNode[],
  defaultCollapsed: boolean = false,
  onParagraphDoubleClick?: (lineIdx: number, text: string) => void,
  editingLineIdx?: number | null
): { nodes: React.ReactNode[] } => {
  const result: React.ReactNode[] = [];

  nodes.forEach((node) => {
    if (node.type === 'heading' && node.level !== undefined) {
      const levelClass = `prd-h${node.level}`;
      const Tag = `h${node.level}` as keyof JSX.IntrinsicElements;

      if (node.level === 1) {
        const childResult = node.children && node.children.length > 0
          ? renderNodes(node.children, false, onParagraphDoubleClick, editingLineIdx)
          : { nodes: [] };
        result.push(
          <div key={node.lineIdx} className={`prd-heading-wrapper ${levelClass}-wrapper`}>
            <div className={`${levelClass}-header`}>
              <div className="prd-title-text">
                <h1 className={`${levelClass}-title`}>{node.text}</h1>
              </div>
            </div>
            <div className={`${levelClass}-line`}></div>
            {node.children && node.children.length > 0 && (
              <div className={`${levelClass}-content`}>
                {childResult.nodes}
              </div>
            )}
          </div>
        );
      } else {
        const childResult = node.children && node.children.length > 0
          ? renderNodes(node.children, false, onParagraphDoubleClick, editingLineIdx)
          : { nodes: [] };
        result.push(
          <CollapsibleSection
            key={node.lineIdx}
            level={node.level}
            text={node.text || ''}
            defaultCollapsed={defaultCollapsed}
          >
            {childResult.nodes}
          </CollapsibleSection>
        );
      }
    } else if (node.type === 'content' && node.raw) {
      // 正在编辑的段落：隐藏内容（编辑区由 MarkdownRenderer 在外部渲染）
      if (editingLineIdx === node.lineIdx) {
        result.push(<div key={node.lineIdx} style={{ display: 'none' }} />);
      } else {
        result.push(
          <div
            key={node.lineIdx}
            className="prd-content-block"
            onDoubleClick={() => onParagraphDoubleClick?.(node.lineIdx, node.raw || '')}
          >
            {renderContent(node.raw)}
          </div>
        );
      }
    }
  });

  return { nodes: result };
};

// 折叠标题组件
const CollapsibleSection: React.FC<{
  level: number;
  text: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}> = ({ level, text, children, defaultCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const levelClass = `prd-h${level}`;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <div className={`prd-heading-wrapper ${levelClass}-wrapper`}>
      <div
        className={`${levelClass}-header prd-collapsible-header`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="prd-title-text">
          <Tag className={`${levelClass}-title`}>{text}</Tag>
        </div>
        <div className="prd-header-actions">
          <span className="prd-collapse-icon">
            {collapsed ? '▶' : '▼'}
          </span>
        </div>
      </div>
      {!collapsed && (
        <>
          <div className={`${levelClass}-line`}></div>
          <div className={`${levelClass}-content`}>
            {children}
          </div>
        </>
      )}
      {collapsed && <div className={`${levelClass}-line`}></div>}
    </div>
  );
};

// 渲染内容行
const renderContent = (raw: string) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div className="prd-table-wrapper">
            <table className="prd-table">{children}</table>
          </div>
        ),
        code: ({ className, children, node, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return <code className="prd-code-inline" {...props}>{children}</code>;
          }
          const lang = className?.replace('language-', '') || '';
          if (lang === 'mermaid') {
            const codeText = (node?.children?.[0] as any)?.value || String(children).trim();
            return <MermaidChart code={codeText} />;
          }
          return (
            <code className={`prd-code-block ${className || ''}`} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="prd-pre">{children}</pre>,
        input: ({ type, checked, ...props }) => {
          if (type === 'checkbox') {
            return (
              <input
                type="checkbox"
                checked={checked}
                readOnly
                className="prd-checkbox"
                {...props}
              />
            );
          }
          return <input type={type} {...props} />;
        },
      }}
    >
      {raw}
    </ReactMarkdown>
  );
};

const MarkdownRenderer: React.FC<{
  content: string;
  onParagraphDoubleClick?: (lineIdx: number, text: string) => void;
  editingLineIdx?: number | null;
  editingText?: string;
  onParagraphChange?: (text: string) => void;
  onParagraphSave?: () => void;
  onParagraphCancel?: () => void;
}> = ({ content, onParagraphDoubleClick, editingLineIdx, editingText, onParagraphChange, onParagraphSave, onParagraphCancel }) => {
  const parsed = parseToTree(content.split('\n'));
  const { nodes: renderedNodes } = renderNodes(
    parsed.nodes, false, onParagraphDoubleClick, editingLineIdx ?? null
  );

  return (
    <div className="prd-content">
      {renderedNodes}
      {/* 段落内嵌编辑区（不受 DOM 层级遮挡） */}
      {editingLineIdx !== null && editingLineIdx !== undefined && (
        <div style={{ marginBottom: 8 }}>
          <textarea
            className="prd-paragraph-textarea"
            style={{ width: '100%', minHeight: 120, padding: '14px 16px', border: '2px solid #667eea', borderRadius: 6, fontFamily: 'Monaco,Menlo,monospace', fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#2d3748', boxShadow: '0 0 0 3px rgba(102,126,234,0.15)' }}
            value={editingText}
            onChange={(e) => onParagraphChange?.(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10, marginBottom: 4 }}>
            <button className="prd-btn prd-btn-secondary" onClick={onParagraphCancel}>取消</button>
            <button className="prd-btn prd-btn-primary" onClick={onParagraphSave}>保存</button>
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_TEMPLATE = (route: string) => `# {页面名称} PRD

## 需求背景

### 痛点
- **问题现象**：
- **发生频率**：高 / 中 / 低
- **当前 workaround**：

### 业务目标
- **量化指标**：
- **目标期限**：

### 涉及系统/模块
- **模块名称**：
- **变更类型**：新增 / 修改 / 删除 / 对接
- **对接接口**：

---

## 用户故事

### 故事1
- **角色**：
- **功能**：
- **收益**：
- **验收条件**：

---

## 需求清单

| 序号 | 需求描述 | 优先级 | 状态 | 负责人 | 截止日期 |
|------|----------|--------|------|--------|----------|
| 1    |          | P0     | TODO |        |          |

- **优先级**：P0（核心流程阻塞）/ P1（重要功能）/ P2（体验优化）/ P3（未来规划）
- **状态**：TODO / IN PROGRESS / DONE / BLOCKED

---

## 业务流程图

\`\`\`mermaid
graph TD
    A[开始] --> B[用户操作]
    B --> C{判断}
    C -->|是| D[系统处理]
    C -->|否| E[提示用户]
    D --> F[结束]
    E --> F
\`\`\`

---

## 页面结构

### 路由信息
- **路由路径**：\`/${route}\`
- **页面标题**：
- **访问权限**：公开 / 登录 / 角色

### 布局结构
- **布局类型**：单栏 / 双栏 / 三栏
- **区域-主内容**：

### Tab 结构（如有）
- **Tab名称**：
- **Tab路由**：
- **加载方式**：预加载 / 懒加载 / keep-alive
- **默认激活**：是 / 否

---

## 功能描述

### 功能点1：{功能名称}

#### 页面级（必须有）
- **字段：功能入口** - 类型：文本；描述：
- **字段：前置条件** - 类型：文本；描述：
- **字段：后置影响** - 类型：字段列表；描述：

#### Tab 级（有 Tab 时才写此节）
- **Tab名称**：
- **查询条件字段**（有查询条件时才写）：
  | 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
  |--------|------|------|--------|------|----------|----------|----------|
  |        |      |      |        |      |          |          |          |
- **操作按钮字段**（有操作按钮时单独列出）：
  | 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
  |--------|------|------|--------|------|----------|----------|----------|
  |        |      |      |        |      |          |          |          |
- **字段列表**：
  | 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
  |--------|------|------|--------|------|----------|----------|----------|
  |        |      |      |        |      |          |          |          |

#### 弹窗级（有弹窗时才写此节）
- **弹窗：{弹窗名称}**
  - **触发入口**：点击 \`{按钮}\` 按钮打开
  - **关闭方式**：遮罩层 / 关闭图标 / 取消按钮 / Esc
  - **字段列表**：
    | 字段名 | 类型 | 必填 | 默认值 | 来源 | 校验规则 | 展示形式 | 交互约束 |
    |--------|------|------|--------|------|----------|----------|----------|
    |        |      |      |        |      |          |          |          |
  - **确定按钮**：调用 \`POST /api/xxx\`，成功关闭弹窗刷新列表，失败显示错误
  - **取消按钮**：关闭弹窗，不修改任何数据

---

## 数据流图

### 接口1：{接口名称}
- **请求路径**：\`GET /api/xxx\`
- **请求方法**：GET / POST / PUT / DELETE
- **请求头**：Authorization / Content-Type
- **请求参数**：
  - \`{参数名}\` - 类型：字符串；必填：是/否；来源：页面字段；校验：
- **响应字段**：
  - \`{响应字段名}\` - 类型：字符串/数字/数组/对象；描述：
  - \`{关联字段}\` - 类型：关联ID；描述：关联到
- **存储位置**：数据库表 / Redis key
- **错误码**：
  - \`{错误码}\` - \`{用户提示}\`

### 数据刷新点
- **刷新时机**：页面加载 / 操作成功后 / 定时轮询 / 手动刷新
- **影响字段**：

---

## 验收标准

### 正常流程
- [ ] **操作**：在 \`{字段A}\` 输入 \`{合法值}\` → **预期**：
- [ ] **操作**：点击 \`{按钮}\` → **预期**：\`{弹窗名称}\` 弹窗打开，各字段显示默认值
- [ ] **操作**：填写完整表单后点击确定 → **预期**：接口被调用，数据更新，提示出现

### 异常流程
- [ ] **操作**：输入 \`{非法值}\` → **预期**：字段下方显示红色错误提示，提交按钮置灰
- [ ] **操作**：不填写 \`{必填字段}\` 直接提交 → **预期**：高亮提示 \`不能为空\`
- [ ] **操作**：网络断开时提交 → **预期**：显示 \`{网络异常提示}\`
- [ ] **操作**：提交后接口返回 403 → **预期**：显示 \`{无权限提示}\`
- [ ] **操作**：提交后接口返回 500 → **预期**：显示 \`{服务器异常}\`，数据未保存

---

## 更新记录

### v1 - ${new Date().toISOString().split('T')[0]}
- 初始版本
`;

export const PrdPanel: React.FC<PrdPanelProps> = ({
  route,
  projectRoot,
  apiBaseUrl,
  basePath = '',
  onSave,
  isOpen = false,
  onToggle,
}) => {
  // 端口从 window 环境变量读取，优先使用外部传入的 apiBaseUrl
  const PRD_PORT = (typeof window !== 'undefined' && (window as any).__PRD_PORT__) || 3001;
  const resolvedApiBaseUrl = apiBaseUrl || `http://localhost:${PRD_PORT}/api/prd`;
  // 优先使用外部传入的isOpen和onToggle，否则使用内部状态
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const actualIsOpen = isOpen !== undefined ? isOpen : isOpenInternal;

  const [state, setState] = useState<PrdState>({
    content: '',
    originalContent: '',
    loading: false,
    error: null,
    isEditing: false,
    isSaving: false,
    hasChanges: false,
    editingLineIdx: null,
    editingText: '',
  });

  // 用 ref 跟踪当前编辑状态，避免闭包捕获旧值
  const editingStateRef = useRef({ editingLineIdx: null as number | null, editingText: '' });

  // 同步 ref 与 state
  useEffect(() => {
    editingStateRef.current = {
      editingLineIdx: state.editingLineIdx,
      editingText: state.editingText,
    };
  }, [state.editingLineIdx, state.editingText]);

  const loadPrd = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      // 优先通过 PRD 服务 API 加载（与 skills prd-inject.js 方式一致）
      const apiUrl = `${resolvedApiBaseUrl}/read?route=${route}`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        const text = typeof data === 'string' ? data : (data.content || '');
        setState(s => ({
          ...s,
          content: text,
          originalContent: text,
          loading: false,
          hasChanges: false,
        }));
      } else {
        // API 失败则降级读取本地 public/prd/_routes/ 文件
        const localUrl = basePath
          ? `/${basePath}/prd/_routes/_${route}.md`
          : `/prd/_routes/_${route}.md`;
        const localResp = await fetch(localUrl);
        if (localResp.ok) {
          const text = await localResp.text();
          setState(s => ({
            ...s,
            content: text,
            originalContent: text,
            loading: false,
            hasChanges: false,
          }));
        } else {
          const template = DEFAULT_TEMPLATE(route);
          setState(s => ({
            ...s,
            content: template,
            originalContent: '',
            loading: false,
            hasChanges: true,
            isEditing: true,
          }));
        }
      }
    } catch (err) {
      setState(s => ({
        ...s,
        error: '加载PRD失败',
        loading: false,
      }));
    }
  }, [route, basePath, resolvedApiBaseUrl]);

  // 路由变化时自动重新加载 PRD（面板打开状态下）
  const prevRouteRef = useRef(route);
  useEffect(() => {
    if (actualIsOpen && route !== prevRouteRef.current) {
      prevRouteRef.current = route;
      loadPrd();
    }
  }, [route]); // eslint-disable-line react-hooks/exhaustive-deps

  // 内容最新值（用于 handleSave 中读取最新 content）
  const contentRef = useRef('');

  // 同步 contentRef 与 state.content
  useEffect(() => {
    contentRef.current = state.content;
  }, [state.content]);

  const handleOpen = useCallback(async () => {
    if (isOpen !== undefined && onToggle) {
      onToggle();
    } else if (!actualIsOpen) {
      setIsOpenInternal(true);
    }
    await loadPrd();
  }, [loadPrd, onToggle, isOpen, actualIsOpen]);

  const handleClose = useCallback(() => {
    if (state.hasChanges) {
      if (confirm('有未保存的修改，确定要关闭吗？')) {
        if (isOpen !== undefined && onToggle) {
          onToggle();
        } else {
          setIsOpenInternal(false);
        }
      }
    } else {
      if (isOpen !== undefined && onToggle) {
        onToggle();
      } else {
        setIsOpenInternal(false);
      }
    }
  }, [state.hasChanges, onToggle, isOpen]);

  const handleEdit = useCallback(() => {
    setState(s => ({ ...s, isEditing: true, editingLineIdx: null }));
  }, []);

  // 双击进入段落编辑模式
  const handleParagraphDoubleClick = useCallback((lineIdx: number, text: string) => {
    setState(s => ({ ...s, editingLineIdx: lineIdx, editingText: text }));
  }, []);

  // 段落编辑内容变化
  const handleParagraphChange = useCallback((text: string) => {
    setState(s => ({ ...s, editingText: text }));
  }, []);

  // 保存段落编辑
  const handleParagraphSave = useCallback(async () => {
    const { editingLineIdx, editingText } = editingStateRef.current;
    if (editingLineIdx === null) return;

    const currentContent = contentRef.current;
    const lines = currentContent.split('\n');

    if (editingLineIdx < 0 || editingLineIdx >= lines.length) return;

    // 找段落结束位置
    let endIdx = editingLineIdx + 1;
    while (endIdx < lines.length && !/^#{1,10}\s/.test(lines[endIdx])) {
      endIdx++;
    }

    // 算出新内容
    const newContent = [
      ...lines.slice(0, editingLineIdx),
      editingText,
      ...lines.slice(endIdx)
    ].join('\n');

    // 1. 更新内存状态
    setState(s => ({
      ...s,
      content: newContent,
      editingLineIdx: null,
      editingText: '',
      originalContent: newContent,
      hasChanges: false,
    }));

    // 2. 同步到 contentRef
    contentRef.current = newContent;

    // 3. 调 API 保存
    try {
      if (onSave) {
        await onSave(newContent);
      } else {
        const saveUrl = `${resolvedApiBaseUrl}/save`;
        const response = await fetch(saveUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ route, content: newContent }),
        });
        if (!response.ok) throw new Error('API failed');
      }
    } catch {
      // API 失败不报错，hasChanges 已在上面清掉，下次手动保存可重试
    }
  }, [onSave, resolvedApiBaseUrl, route]);

  // 取消段落编辑
  const handleParagraphCancel = useCallback(() => {
    setState(s => ({ ...s, editingLineIdx: null, editingText: '' }));
  }, []);

  const handleCancel = useCallback(() => {
    if (state.hasChanges) {
      if (confirm('有未保存的修改，确定取消吗？')) {
        setState(s => ({
          ...s,
          content: s.originalContent,
          isEditing: false,
          hasChanges: false,
        }));
      }
    } else {
      setState(s => ({ ...s, isEditing: false }));
    }
  }, [state.hasChanges]);

  const handleContentChange = useCallback((newContent: string) => {
    setState(s => ({
      ...s,
      content: newContent,
      hasChanges: newContent !== s.originalContent,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setState(s => ({ ...s, isSaving: true, error: null }));
    const latestContent = contentRef.current;

    try {
      let success = false;

      if (onSave) {
        // 使用自定义保存函数
        success = await onSave(latestContent);
      } else {
        // 调用后端 API 保存（resolvedApiBaseUrl 默认为 http://localhost:3001/api/prd）
        const saveUrl = `${resolvedApiBaseUrl}/save`;
        const response = await fetch(saveUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ route, content: latestContent }),
        });
        success = response.ok;

        // API 不通则降级为下载
        if (!success) {
          const blob = new Blob([latestContent], { type: 'text/markdown;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `_${route}.md`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          success = true;
        }
      }

      setState(s => ({
        ...s,
        originalContent: latestContent,
        isEditing: false,
        isSaving: false,
        hasChanges: false,
      }));
    } catch (err) {
      setState(s => ({ ...s, error: '保存失败', isSaving: false }));
    }
  }, [onSave, route, resolvedApiBaseUrl]);

  const currentVersion = state.content.match(/### v(\d+)/)?.[1] || '1';
  const currentDate = state.content.match(/### v\d+ - (\d{4}\/\d{2}\/\d{2})/)?.[1] || '';
  const currentTime = state.content.match(/### v\d+ - \d{4}\/\d{2}\/\d{2}(\s+\d{2}:\d{2})?/)?.[1]?.trim() || '';

  return (
    <div className="h-full flex-shrink-0">
      {/* 悬浮按钮 */}
      <button
        className="prd-float-btn"
        onClick={handleOpen}
        title="PRD 文档"
      >
        PRD
      </button>

      {/* PRD 侧边栏 - 只在打开时渲染 */}
      {actualIsOpen && (
        <div
          className="h-full flex flex-col z-[9998] bg-white"
          style={{ width: 560 }}
        >
          <div className="prd-panel">
            <div className="prd-header">
              <div className="prd-title">
                <h3>PRD: {route}</h3>
                {state.content && (
                  <span className="prd-version-badge">v{currentVersion}{currentDate && ` - ${currentDate}`}{currentTime && ` ${currentTime}`}</span>
                )}
                {state.hasChanges && (
                  <span className="prd-unsaved-dot" title="有未保存的修改" />
                )}
              </div>
              <div className="prd-actions">
                {!state.isEditing ? (
                  <>
                    <button
                      className="prd-btn prd-btn-secondary"
                      onClick={() => loadPrd()}
                      disabled={state.loading}
                      title="刷新"
                    >
                      ↻
                    </button>
                    <button
                      className="prd-btn prd-btn-secondary"
                      onClick={() => {
                        const blob = new Blob([state.content], { type: 'text/markdown;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `_${route}.md`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      disabled={!state.content}
                    >
                      下载
                    </button>
                    <button
                      className="prd-btn prd-btn-primary"
                      onClick={handleEdit}
                      disabled={state.loading}
                    >
                      编辑
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="prd-btn prd-btn-secondary"
                      onClick={handleCancel}
                      disabled={state.isSaving}
                    >
                      取消
                    </button>
                    <button
                      className="prd-btn prd-btn-primary"
                      onClick={handleSave}
                      disabled={state.isSaving}
                    >
                      {state.isSaving ? '保存中...' : '保存'}
                    </button>
                  </>
                )}
                <button
                  className="prd-btn prd-btn-close"
                  onClick={handleClose}
                >
                  ✕
                </button>
              </div>
            </div>

            {state.error && (
              <div className="prd-error-bar">{state.error}</div>
            )}

            {state.loading ? (
              <div className="prd-loading">加载中...</div>
            ) : state.isEditing ? (
              <div className="prd-editor">
                <textarea
                  className="prd-editor-textarea"
                  value={state.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="输入 PRD 内容..."
                  spellCheck={false}
                />
              </div>
            ) : (
              <MarkdownRenderer
                content={state.content}
                onParagraphDoubleClick={handleParagraphDoubleClick}
                editingLineIdx={state.editingLineIdx}
                editingText={state.editingText}
                onParagraphChange={handleParagraphChange}
                onParagraphSave={handleParagraphSave}
                onParagraphCancel={handleParagraphCancel}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PrdPanel;
