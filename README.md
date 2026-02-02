# Myastoriya Boxes Microsite

Marketing microsite for Myastoriya Boxes with fast filters and deep links to the main store.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Static build

```bash
npm run generate
npm run generate:sitemap
```

The static output is generated in `.output/public` and can be deployed to any static host.

## Scraping data

```bash
npm run scrape-boxes
```

This script fetches the category pages, visits each product page, and regenerates `data/boxes.json`.

## Deployment notes

- `nitro` is configured with the `static` preset for fast, static hosting.
- Update `NUXT_PUBLIC_ANALYTICS_PROVIDER` in the environment to enable analytics events.
- Ensure `public/sitemap.xml` and `public/robots.txt` are deployed alongside the site.
