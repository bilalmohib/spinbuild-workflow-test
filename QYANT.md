# spinbuild-workflow-test

## What we are building

Imported from bilalmohib/spinbuild-workflow-test. A complete original Spinbuild
landing page with Apple-inspired product presentation, responsive navigation,
a workflow concept preview and a local interactive demonstration.

## Stack

- Static HTML, CSS and JavaScript. No build step, no framework, no bundler.
- Single page: root `index.html`, `public/styles.css` and module `public/app.js`.
- No server code, no database, no installed dependencies.
- Optional Three.js 0.170.0 browser module loaded from jsDelivr; HTML laptop
  illustration remains available when reduced motion is enabled or WebGL fails.

## Data model

None. The site stores no data.

## Pages and routes

- `index.html` — the only page. Includes hero, overview, feature details,
  three-template interactive workflow demonstration, closing section and FAQs.
- Navigation targets: `#home`, `#overview`, `#details`, `#playground`.
- Demo progress is temporary browser memory, not saved or connected to services.

## Environment

None. No environment variables are used.

## Decisions

- Preserved the imported static root entry point; shared assets live in `public/`.
- Original branding with Apple-inspired restraint, warm white surfaces, system
  typography and forest green (`#246345`); no gradients.
- Procedural Three.js laptop has scroll-linked perspective, lazy initialization,
  offscreen pausing and resource cleanup. Reduced motion uses the HTML fallback.
- No authentication is needed for the public, non-persistent concept demo.

## Change log

- Memory file added to an existing project; pending reconstruction.
- Reconstructed QYANT.md from the actual files and added a small hero section to `index.html`.
- Expanded the hero into a complete responsive product landing page with original visuals, optional 3D and a working local workflow demo.