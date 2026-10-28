import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// GitHub Pages 项目页需要部署在 /<仓库名>/ 下，由环境变量注入；
// 根路径部署（Vercel / 本地）时保持默认 '/'。
const base = process.env.VITE_BASE || '/'

// 生成 404.html：GitHub Pages 对未知路径返回它。
// 记下原始地址后跳回站点根，由 index.html 中的脚本还原路径再交给 vue-router。
function spaFallback () {
  return {
    name: 'spa-fallback',
    apply: 'build',
    closeBundle () {
      const dir = resolve(process.cwd(), 'dist')
      const redirect = `<script>
(function () {
  try { sessionStorage.setItem('spa_redirect', location.pathname + location.search + location.hash) } catch (e) {}
  location.replace(${JSON.stringify(base)})
})()
</script>`
      writeFileSync(resolve(dir, '404.html'), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>404 Not Found</title>
    ${redirect}
  </head>
  <body></body>
</html>
`)
    }
  }
}

export default defineConfig({
  base,
  plugins: [vue(), spaFallback()],
  server: { host: '127.0.0.1', port: 5173, open: false }
})
