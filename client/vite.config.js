import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: ".",
  plugins: [
    vue(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      protocolImports: true,
      include: ['buffer', 'process', 'util', 'stream', 'events', 'http', 'https', 'url']
    })
  ],
  define: {
    global: 'window',
    'process.env': {}
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
    ]
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        format: 'es',
        inlineDynamicImports: false,
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  },
  base: '/',
  preview: {
    port: 3333,
    strictPort: true,
  },
  server: {
    port: 3333,
    strictPort: true,
    host: true,
    origin: 'http://0.0.0.0:3333',
  }
}))
