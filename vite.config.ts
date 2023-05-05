import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
        scss: {
            additionalData: `
                @use "sass:color";
                @import "./src/ui/theme/colors";`,
        },
    },
    modules: {
        scopeBehaviour: "global",
    },
  },
  plugins: [vue()],
})