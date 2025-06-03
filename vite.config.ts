import {defineConfig} from 'vite'
import path from 'path'

export default defineConfig({
  root: './src',
  base: '/',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@core': path.resolve(__dirname, './src/core'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@components': path.resolve(__dirname, './src/components'),
    },
    extensions: ['.ts', '.js', '.scss', '.svg']
  },
  optimizeDeps: {
    include: ['imask'],
    exclude: ['vite-plugin-svg-icons']
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
})