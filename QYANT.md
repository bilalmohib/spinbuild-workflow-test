# spinbuild-workflow-test

## What we are building

Imported from bilalmohib/spinbuild-workflow-test. A minimal static landing page
with a small hero section (eyebrow, headline, supporting copy and two CTAs).

## Stack

- Static HTML, CSS and JavaScript. No build step, no framework, no bundler.
- Single page: root `index.html` with inline `<style>`.
- No server code, no database, no dependencies.

## Data model

None. The site stores no data.

## Pages and routes

- `index.html` — the only page. Contains a hero section with a primary
  "Get started" button and a secondary "Learn more" button (both anchor links).

## Environment

None. No environment variables are used.

## Decisions

- Kept the site as a single static `index.html` with inline styles rather than
  introducing a stylesheet or server, since the request was for a small hero only.
- Accent colour is forest green (`#1d6f42`) on a light neutral background.

## Change log

- Memory file added to an existing project; pending reconstruction.
- Reconstructed QYANT.md from the actual files and added a small hero section to `index.html`.