import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import http from 'http'
import os from 'os'
import { spawn } from 'child_process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// PRD 插件（lto手机端使用端口 3002）
function prdPlugin() {
  const PRD_PORT = 3002
  const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills', 'prd')
  let daemonProcess = null

  return {
    name: 'vite-plugin-prd',
    async configureServer(vite) {
      const projectRoot = vite.config.root || process.cwd()

      const srcHtml = path.join(SKILLS_DIR, 'prd.html')
      const destHtml = path.join(projectRoot, 'public', 'prd.html')
      if (fs.existsSync(srcHtml) && !fs.existsSync(destHtml)) {
        fs.copyFileSync(srcHtml, destHtml)
        console.log('[PRD] ✅ prd.html → public/prd.html')
      }

      const pd = path.join(projectRoot, 'public', 'prd', '_routes')
      if (!fs.existsSync(pd)) fs.mkdirSync(pd, { recursive: true })

      const daemonFile = path.join(SKILLS_DIR, 'prd-daemon.js')
      if (fs.existsSync(daemonFile)) {
        daemonProcess = spawn('node', [daemonFile], {
          cwd: projectRoot,
          detached: true,
          stdio: 'ignore',
          env: { ...process.env, PRD_PORT: String(PRD_PORT), PROJECT_ROOT: projectRoot },
        })
        daemonProcess.unref()
        console.log(`[PRD] 🚀 PRD 服务启动中 (端口 ${PRD_PORT})...`)
      }

      await new Promise(r => setTimeout(r, 1500))

      vite.middlewares.use((req, res, next) => {
        const p = (req.url || '').split('?')[0]
        if (p.startsWith('/api/prd')) {
          const opts = {
            hostname: 'localhost',
            port: PRD_PORT,
            path: req.url,
            method: req.method,
            headers: { ...req.headers },
          }
          const pr = http.request(opts, prRes => {
            res.writeHead(prRes.statusCode, prRes.headers)
            prRes.pipe(res, { end: true })
          })
          req.pipe(pr, { end: true })
          return
        }
        next()
      })

      console.log(`[PRD] 📋 打开: http://localhost:5173/lto-app/，左下角有 [PRD] 按钮`)
    },
    transformIndexHtml(html, ctx) {
      const base = (ctx.server.config.base || '/').replace(/\/$/, '') + '/'
      if (!html.includes('__PRD_PORT__')) {
        return html.replace('</body>', `<script>window.__PRD_PORT__=${PRD_PORT};</script>\n<script src="${base}prd-inject.js"></script>\n</body>`)
      }
      if (!html.includes('prd-inject.js')) {
        return html.replace('<script src="/prd-inject.js"></script>', `<script src="${base}prd-inject.js"></script>`)
      }
      return html
    },
    closeBundle() {
      if (daemonProcess) {
        daemonProcess.kill()
        daemonProcess = null
        console.log('[PRD] 🛑 PRD 服务已关闭')
      }
    },
  }
}

export default defineConfig({
  base: '/lto-app/',
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    prdPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
