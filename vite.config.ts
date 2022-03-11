import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: "src/quasar-variables.sass",
    }),
    vueJsx(),
  ],
  test: {
    globals: false,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
