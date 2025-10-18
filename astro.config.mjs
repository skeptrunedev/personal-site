// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import markdoc from "@astrojs/markdoc";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import devtoolsJson from "vite-plugin-devtools-json";
import { SiteUrl } from "./src/theme.config";
import fs from "fs";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// Load Caddyfile grammar
const caddyfileGrammarJson = JSON.parse(
  fs.readFileSync("./src/grammars/caddyfile.tmLanguage.json", "utf8")
);

// Create the language object with required properties
const caddyfileGrammar = {
  id: "caddyfile",
  scopeName: caddyfileGrammarJson.scopeName,
  name: caddyfileGrammarJson.name || "Caddyfile",
  repository: caddyfileGrammarJson.repository,
  patterns: caddyfileGrammarJson.patterns,
  grammar: caddyfileGrammarJson,
  aliases: ["caddy", "Caddyfile"],
};

// https://astro.build/config
export default defineConfig({
  site: SiteUrl,
  base: "/",
  output: "static",
  devToolbar: {
    enabled: false,
  },
  image: {
    domains: ["127.0.0.1"],
  },
  markdown: {
    shikiConfig: {
      langs: [caddyfileGrammar],
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
    ],
  },
  integrations: [
    markdoc(),
    sitemap({
      filter: (page) =>
        page.includes("ai-horseless-carriages") && !page.includes("xgboost"),
    }),
    icon(),
    mdx(),
  ],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
        buffer: "buffer",
      },
    },
    plugins: [tailwindcss(), devtoolsJson()],
    optimizeDeps: {
      include: ["buffer"],
    },
    define: {
      global: "globalThis",
    },
    preview: {
      allowedHosts: true,
    },
    build: {
      rollupOptions: {
        output: {
          globals: {
            buffer: "Buffer",
          },
        },
      },
    },
  },
  redirects: {
    "/posts/git-worktrees-with-AI/": "/posts/git-worktrees-agents-and-tmux/",
    "/posts/posts/making-sites-accessible-for-agents/":
      "/posts/use-the-accept-header-to-serve-markdown-instead-of-html-to-llms/",
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Lora",
        cssVariable: "--font-lora",
      },
    ],
  },
});
