import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        REACT_APP_ALERTZY_TOKEN: JSON.stringify(env.REACT_APP_ALERTZY_TOKEN || ''),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api/alertzy': {
          target: 'https://alertzy.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/alertzy/, ''),
          secure: true,
        },
      },
    },
    build: {
      outDir: 'dist',
    },
  };
});

