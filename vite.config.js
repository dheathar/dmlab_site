import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'pages/about.html'),
        team: resolve(__dirname, 'pages/team.html'),
        research: resolve(__dirname, 'pages/research.html'),
        projects: resolve(__dirname, 'pages/projects.html'),
        publications: resolve(__dirname, 'pages/publications.html'),
        infrastructure: resolve(__dirname, 'pages/infrastructure.html'),
        news: resolve(__dirname, 'pages/news.html'),
        teaching: resolve(__dirname, 'pages/teaching.html'),
        contact: resolve(__dirname, 'pages/contact.html'),
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  preview: {
    port: 4173,
  },
});
