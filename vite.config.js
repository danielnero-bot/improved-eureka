import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: "/improved-eureka/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['react-icons/fi', 'react-icons/md', 'react-icons/fa', 'react-icons/io5', 'react-icons/fa6', 'react-icons/io'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
});
