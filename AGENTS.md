# AGENTS.md

## Cursor Cloud specific instructions

This is Nick Khami's personal blog/portfolio — an **Astro 5** static site with MDX blog posts, Tailwind CSS 4, and an optional Cloudflare Worker for content negotiation. No database or Docker required.

### Key commands

| Task | Command |
|---|---|
| Install deps | `yarn install` |
| Dev server | `yarn dev` (serves on `http://localhost:4321`) |
| Type check | `npx astro check` |
| Build | `yarn build` |
| Preview build | `yarn preview` |

### Gotchas

- **Yarn 4.9.2 (Berry)** is required. Before `yarn install`, run `corepack enable && corepack prepare yarn@4.9.2 --activate` if corepack isn't already set up.
- The `.yarnrc.yml` uses `nodeLinker: node-modules`, so there is a standard `node_modules/` directory.
- `yarn build` includes a post-build step (`convert-to-markdown.sh`) that converts HTML to Markdown for LLM serving; this requires `@wcj/html-to-markdown-cli` which is a devDependency.
- There are no automated test suites in this project — validation is done via `astro check` (type checking) and manual browser testing.
- The `data-analysis/` directory contains Jupyter notebooks and CSVs for offline analysis; it is excluded from TypeScript compilation and the Astro build.
- To run the dev server on all interfaces (useful in cloud VMs), use `yarn dev --host 0.0.0.0`.
