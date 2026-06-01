import { resolve } from "node:path"
import { existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import dts from "vite-plugin-dts"
import { defineConfig } from "vite"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const componentsDir = resolve(__dirname, "src/components")

/**
 * Auto-discover component entry points from src/components/.
 * Each subfolder with an index.ts(x) is treated as a separate entry,
 * so consumers can tree-shake by importing only what they use.
 */
function getComponentEntries(): Record<string, string> {
  const entries: Record<string, string> = {}
  if (!existsSync(componentsDir)) return entries

  const folders = readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))

  for (const folder of folders) {
    const indexTs = resolve(componentsDir, folder.name, "index.ts")
    const indexTsx = resolve(componentsDir, folder.name, "index.tsx")
    const entry = existsSync(indexTs)
      ? indexTs
      : existsSync(indexTsx)
        ? indexTsx
        : null
    if (entry) {
      entries[`src/components/${folder.name}/index`] = entry
    }
  }

  return entries
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
      outDir: "dist",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        ...getComponentEntries(),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        preserveModules: false,
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
})
