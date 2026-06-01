import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

/**
 * Separate Vite config for building the inspired-tokens.css bundle.
 *
 * This does NOT process through Tailwind — it only resolves @import
 * directives and concatenates the CSS files. The output preserves
 * @theme and @custom-variant directives so consumers' Tailwind builds
 * can process them.
 *
 * Usage: vite build --config vite.css.config.ts
 */
export default defineConfig({
  build: {
    // Don't wipe dist — the lib build runs first
    emptyOutDir: false,
    outDir: "dist",
    rollupOptions: {
      input: {
        "inspired-tokens": resolve(__dirname, "src/styles/inspired-tokens.css"),
      },
      output: {
        assetFileNames: "[name][extname]",
      },
    },
    cssMinify: false,
  },
})
