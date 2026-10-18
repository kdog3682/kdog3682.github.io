import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Source lives in app/; the build is written to the repo root so GitHub Pages
// serves it next to the legacy static pages (codework.html, animals/, ...).
export default defineConfig({
  root: "app",
  base: "./",
  plugins: [react()],
  build: { outDir: "..", emptyOutDir: false, assetsDir: "assets" },
})
