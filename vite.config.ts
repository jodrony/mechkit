import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

// Custom plugin to ensure all PDF requests from public are directly served with application/pdf
// and never intercepted by SPA fallback / index.html
function pdfServePlugin(): Plugin {
  return {
    name: 'pdf-serve-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const pathname = decodeURIComponent(req.url.split('?')[0]);
          if (pathname.endsWith('.pdf')) {
            const filePath = path.join(process.cwd(), 'public', pathname);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const fileName = path.basename(filePath);
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
              const stat = fs.statSync(filePath);
              res.setHeader('Content-Length', stat.size);
              const fileStream = fs.createReadStream(filePath);
              return fileStream.pipe(res);
            }
          }
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pdfServePlugin()],
  server: {
    port: 5173,
  },
})

