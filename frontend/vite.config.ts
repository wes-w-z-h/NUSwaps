import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(mode);
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target:
            mode === 'docker'
              ? 'http://server:4000/api'
              : 'http://localhost:4000/api',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      port: 3000,
    },
  };
});
