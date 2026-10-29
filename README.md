# Kaleab Taye portfolio

Static HTML, CSS, and JavaScript. No build or compilation step is required.

## Preview

```sh
python3 -m http.server 18771 --bind 127.0.0.1
```

Open http://127.0.0.1:18771.

## Browser verification

The regression script requires Playwright and Chrome. Install Playwright in a separate tooling directory, or use an existing installation through `NODE_PATH`:

```sh
NODE_PATH=/path/to/node_modules node tests/browser.cjs
```

Optional environment variables: `PORTFOLIO_URL` (default: local preview above) and `CHROME_PATH` (default: `/usr/bin/google-chrome`). Screenshots are written to `/tmp/portfolio-*.png`.

Checks cover five viewport sizes, horizontal overflow, all 29 project viewers, carousel wrapping, portrait views, toolbox filters, theme persistence, reduced motion, compact timeline selection, project deep links, local links and assets, and browser errors. This is Chromium coverage; Safari, Firefox, real-device gestures, and external-site availability require separate verification.

## Responsive experience

The original scroll-driven journey runs on larger, taller screens. On screens at most 640px wide or 760px tall, chapters are selected directly from the timeline rail to keep all content reachable without a pinned panel taller than the screen. `experience.css` contains the responsive and interaction refinements, loaded after the original styles.

## Design and verification

`ocean.css` defines the ocean/emerald tokens and component refinements after the original styles. Existing project and technology branding remains authentic. Motion respects the system preference and the saved user setting, pauses offscreen/background decoration, and simplifies optional effects when Save-Data is enabled.

Additional verification (using the same Playwright setup above):

```sh
NODE_PATH=/path/to/node_modules node tests/refinement.cjs
NODE_PATH=/path/to/node_modules node tests/performance.cjs /tmp/portfolio-measurements.json
```

See `docs/portfolio-review.md` for the audit, design decisions, measured comparison, coverage and limitations. Static fallback project/timeline text must be updated alongside changes to `portfolio-data.js` or `shared-work.js`.
