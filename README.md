# Bengal Wiki 

Welcome to **Bengal Wiki** (`bengal.wiki`), a premium, highly aesthetic, open-source collaborative digital encyclopedia dedicated to mapping and preserving the rich history, vibrant culture, outstanding personalities, and prominent locations of the Bengal region.

The platform is designed to look like a modernized, premium version of a classical **Wikipedia page**, built with a high-performance, server-first architecture. It is fully responsive, full-width (no sidebars), and manages all articles as static Markdown files powered by Git.

---

## Key Features

* **Wikipedia Aesthetic (Modernized)**: Clean borders, structured fact tables, light-gray layouts, and elegant serif typography (`Lora` headings paired with `Inter` body text).
* **Fully Responsive & Full-Width**: No left sidebars. A spacious, readable, centered layout that responsively fits mobile devices (collapsing Table of Contents, swipable tab bars, and stacked infoboxes).
* **Smart SVG Graphical Placeholders**: A custom inline vector generator (`SvgPlaceholder.astro`) that dynamically outputs rich, lightweight illustrations based on article categories (e.g., stylized portraits for people, terracotta arches for monuments, hills/tea gardens for nature, and contour locator maps for places) instead of blank gray boxes.
* **Dynamic Autocomplete Search**: An interactive autocomplete search bar (`WikiSearch.astro`) powered by a static search index compiled at build time (`search.json.ts`), supporting full keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
* **Interactive Facts InfoBox**: A floating fact card component (`InfoBox.astro`) that automatically maps frontmatter parameters to structured tables, converting inline bullet points and markdown bolding into HTML formatting dynamically.
* **Automatic Table of Contents**: Dynamic catch-all route (`[...slug].astro`) parses headings and automatically inserts a collapsible "Contents [hide/show]" block in long-form articles.
* **Dynamic Database Statistics**: Special `Special:Statistics` page (`statistics.astro`) that dynamically tracks database sizes and lists an active directories index.
* **100% Operational Git Actions**: Replaced mock logins with a Git platform bar. The classic tabs (**Read**, **View Source**, and **View History**) dynamically map to the active source file's location and commit logs directly on GitHub.
* **Automated XML Sitemap Index Splitting**: A custom post-build script (`scripts/split-sitemap.js`) segments the compiled sitemap automatically by category (`sitemap-main.xml`, `sitemap-places.xml`, `sitemap-people.xml`) and overwrites `sitemap.xml` with a sitemap index for search engine optimization.

---

## Tech Stack & Utilities

1. **Framework**: [Astro v7](https://astro.build) (delivering zero-Javascript, static HTML by default).
2. **Styling**: Vanilla HSL-based CSS variables, ensuring light-weight load speeds and modular styling rules.
3. **Database**: Decentralized local Markdown (`.md`) files (includes 580+ enriched profiles for colleges and universities in West Bengal).
4. **Validation**: Strict schema validation using [Zod](https://zod.dev) inside the Astro content collections layer.
5. **Package Management**: Specifying `pnpm@11.8.0` in `package.json` for deterministic package resolution and running on Node 24 runners in CI/CD.

---

## Project Directory Structure

```
bengal.wiki/
├── public/                 # Static public assets (favicons, manifest)
├── src/
│   ├── assets/             # Component assets and images
│   ├── components/         # Modular layout components
│   │   ├── InfoBox.astro        # Right-aligned facts infobox card
│   │   ├── SvgPlaceholder.astro # Dynamic SVG theme-graphic generator
│   │   ├── WikiFooter.astro     # Wiki disclaimers & licensing footer
│   │   ├── WikiHeader.astro     # Nav tabs, SVG logo & metanav git bar
│   │   └── WikiSearch.astro     # Autocomplete client-side search box
│   ├── content/
│   │   └── pages/          # Local Markdown (.md) database corpus
│   │       ├── people/          # Biographies (Tagore, Satyajit Ray, etc.)
│   │       ├── places/          # Geography & Sites (Sundarbans, Darjeeling, etc.)
│   │       ├── songs/           # Anthems & music (Jana Gana Mana, etc.)
│   │       ├── culture.md       # Art & Culture overview article
│   │       ├── history.md       # History overview article
│   │       └── index.md         # Welcome index node
│   ├── layouts/
│   │   └── Layout.astro         # Main HTML layout, fonts, and global CSS
│   ├── pages/              # Astro routes & dynamic endpoints
│   │   ├── [...slug].astro      # Dynamic article catch-all route & TOC parser
│   │   ├── index.astro          # Wikipedia-themed Home Page dashboard
│   │   ├── people.astro         # Eminent People portal directory listings
│   │   ├── places.astro         # Prominent Places portal directory listings
│   │   ├── songs.astro          # Legendary Songs portal directory listings
│   │   ├── statistics.astro     # Special:Statistics dynamic database indexes
│   │   └── search.json.ts       # Automated compilation-ready search API index
│   ├── content.config.ts   # Astro collection schemas and Zod validators
│   └── env.d.ts
├── astro.config.mjs        # Astro configuration & Site URL domain parameters
├── package.json            # Node scripts & dependencies
└── tsconfig.json
```

---

## Document Schemas & Frontmatter

All articles inside the `pages` collection must declare their metadata parameters inside their Markdown frontmatter matching the schema below:

```yaml
---
title: "Article Title"
description: "A short, descriptive, single-sentence summary of the subject."
image_type: "person" # Options: person, monument, nature, map, song, generic
image_caption: "Caption displayed directly beneath the vector placeholder."
facts:
  Key 1: "Value details (supports HTML <br> or links)"
  Key 2: "Value details"
categories:
  - "Primary Category Name"
  - "Secondary Category Name"
---
```

---

## Command Line Scripts

All commands are run from the project root using a terminal:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Launches the local hot-reloading dev server at `localhost:4321` |
| `npm run build` | Compiles the production-ready static site inside `./dist/` |
| `npm run preview` | Previews the compiled production build locally |
| `npm run astro ...` | Runs native Astro CLI commands |

---

## Contributing

Since Bengal Wiki is completely open-source, the content is managed entirely through **Git**:
1. To report an issue, open a ticket on our [Issue Tracker](/contact).
2. To modify or add a page, create a Markdown file matching our schema inside `src/content/pages/` and submit a [Pull Request](/developers).
3. To view the source code or edit details of any page, click the **View Source** tab at the top of the article to jump straight to the source file on GitHub.
