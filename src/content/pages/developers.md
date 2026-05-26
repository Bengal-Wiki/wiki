---
title: "Developers"
description: "Developer resources, technical design schemas, search endpoints, and codebase details for Bengal Wiki."
categories:
  - "Official policies"
---

Welcome to the **Bengal Wiki Developer Portal**. This page outlines the technical specifications of the project and guides you on how to access our public endpoints, compile the codebase locally, and contribute new features.

## 1. Technical Architecture

Bengal Wiki is engineered using a highly performant, server-first framework designed to deliver static content with maximum efficiency:
* **Framework**: [Astro v6](https://astro.build) (utilizing content collection layers).
* **Styling**: Vanilla HSL variables, ensuring absolute flexibility without the overhead of heavy CSS utility frameworks.
* **Hosting**: Completely static pages, deployable to high-performance CDNs (Netlify, Vercel, or GitHub Pages).

## 2. Public API Endpoints

We expose a lightweight search index API at compile time for third-party integrations or local matching scripts.

### Search Index Endpoint

* **URL**: `/search.json`
* **Method**: `GET`
* **Content-Type**: `application/json`
* **Output Format**:
  ```json
  [
    {
      "title": "Rabindranath Tagore",
      "slug": "people/rabindranath-tagore",
      "description": "Nobel laureate poet, polymath, writer, composer, and artist who reshaped Bengali literature and music."
    },
    ...
  ]
  ```

This JSON endpoint is updated automatically during each compile and can be fetched dynamically (e.g., using `fetch('/search.json')`).

## 3. Contributing Code

The project is open source and open to [pull requests](https://github.com/Bengal-Wiki/wiki/pulls):
* **Code Standard**: All layout designs, pages, and components utilize standard HTML/Astro markup with strict separation of styles.
* **Pre-population**: To add a new biography, location profile, or song:
  1. Add a standard markdown `.md` file under the appropriate subdirectory inside [src/content/pages/](https://github.com/Bengal-Wiki/wiki/tree/main/src/content/pages).
  2. Declare the facts keys matching our Zod Schema validation defined inside [src/content.config.ts](https://github.com/Bengal-Wiki/wiki/blob/main/src/content.config.ts).
  3. Run the local test build: `npm run build` to verify there are no validation conflicts.
