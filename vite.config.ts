import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

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
    plugins: [
        vue(),
        VitePWA({
            disable: false,
            includeAssets: ["robots.txt", "favicon.svg"],
            srcDir: "src",
            strategies: "generateSW",
            manifest: {
                name: "Read That",
                short_name: "Read That",
                theme_color: "#1e1e1e",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
});
