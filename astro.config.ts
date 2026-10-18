import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

const LISTED_PREFIXES = ["/blog", "/worksheets"]

export default defineConfig({
  site: "https://kdog3682.github.io",
  integrations: [
    react(),
    sitemap({
      // unlisted posts live at the root, so only allow known listed sections
      filter: (page) => {
        const { pathname } = new URL(page)
        return pathname === "/" || LISTED_PREFIXES.some((p) => pathname.startsWith(p))
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
