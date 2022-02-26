/* eslint '@typescript-eslint/no-unnecessary-condition': 'off' */
/* eslint '@typescript-eslint/no-unsafe-assignment': 'off' */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { fileURLToPath, URL } from 'node:url'
import eslintPlugin from '@nabla/vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      formatter: 'stylish'
    }),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] })
  ],
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')
      ]
    }
  }
  /*
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  */
})
