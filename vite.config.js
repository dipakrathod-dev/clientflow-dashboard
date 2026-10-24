import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/]react(?:-dom)?[\\/]/,
              priority: 30,
            },
            {
              name: 'firebase-vendor',
              test: /node_modules[\\/](?:firebase|@firebase)[\\/]/,
              priority: 25,
              maxSize: 300000,
            },
            {
              name: 'charts-vendor',
              test: /node_modules[\\/](?:recharts|d3-[^\\/]+)[\\/]/,
              priority: 20,
              maxSize: 300000,
            },
            {
              name: 'ui-vendor',
              test: /node_modules[\\/](?:framer-motion|lucide-react|react-icons|react-hot-toast|react-router-dom)[\\/]/,
              priority: 15,
              maxSize: 300000,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              priority: 10,
              maxSize: 300000,
            },
          ],
        },
      },
    },
  },
})
