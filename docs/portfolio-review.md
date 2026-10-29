# Portfolio refinement — 29 October 2026

## Scope and current state

Repository: `kaleab-taye-luxodd/kaleab-taye-portfolio`, branch `main`. Static HTML/CSS/JavaScript; no framework, package manifest, build step, or configured linter. Existing local responsive timeline, navigation, keyboard focus, reduced-motion, and ocean/emerald work was preserved. A pre-refinement source snapshot was saved under `/tmp/portfolio-refinement-baseline` for this session.

Preview: `python3 -m http.server 18771 --bind 127.0.0.1` from the repository. Existing production configuration: GitHub Pages, `main`, repository root; CNAME `kaleab-taye.dev`.

The implementation includes a software-process hero (CSS and SVG, no WebGL or canvas), 29 projects, a scroll-driven desktop timeline/direct-selection compact timeline, engagements, published contract records, an authentic graduation portrait with Amharic lettering, eight technology collections, and direct email/résumé/social actions. There is no mobile menu, contact form, backend submission, analytics, video, or heavy third-party JavaScript. Compact navigation remains directly available.

## Prioritized audit and corrections

| Priority / type | Evidence and visitor impact | Implemented correction | Risk / dependency |
| --- | --- | --- | --- |
| P1 functionality/accessibility | `setMotion` accepted a manual `false` despite the system preference; system events also overwrote saved manual choices. | Separate stored manual choice from effective motion. System reduction always wins, user-off survives preference changes, startup class prevents saved-off animation flashes. | Preference-change and storage-denial checks required. |
| P1 progressive enhancement | Projects and timeline were populated only by JavaScript. A blocked script left those records unavailable. | Add a native disclosure with all 29 project descriptions, contributions and source links; prerender accessible timeline text. On JavaScript visits, materialize directory records on first opening using the same no-script source. Email, résumé, about and skills remain native content. | Directory keeps complete no-script HTML but defers its enhanced DOM until opened; benchmark includes it. Dynamic carousels/dialogs still require JS. |
| P1 verified fallback defect | No-script layout testing found horizontal overflow: the visually hidden timeline retained `white-space: nowrap` when exposed. | Explicitly restore wrapping in no-script styles. | Fixed and retested at 390px. |
| P1 interaction | The carousel intercepted vertical wheel input and prevented native page scrolling. | Preserve vertical scrolling; retain native touch/horizontal scrolling, arrow buttons, picker, dots and keyboard controls. | Deliberate interaction change; existing carousel regression suite rerun. |
| P2 communication | Hero role was small; cards described products without directly showing personal scope. Navigating 29 items serially was burdensome. | Clarify full-stack positioning and introduction, distinguish primary CTA, show each contribution inline, add complete browsable project directory. | No new claims, employers, results or availability invented. Missing private project outcomes remain factual gaps. |
| P2 navigation | Intersection ratios were stored from old observer entries, so active links could reflect stale intersections. Header lacked a readable surface over scrolled content. | Determine active section from current geometry in the existing throttled scroll update; add solid scrolled header surface. | Geometry checked across seven widths. Test now waits for the actual browser update rather than assuming a fixed delay. |
| P2 motion/performance | Source contains dozens of animated decorations and backdrop blurs; badges and record cards used repeated blur layers. Timeline had a 55px blurred full-section image. | Pause decorative sections offscreen/background, remove tag/record/stack blur, reduce panel and modal blur, remove full-page grain layer and timeline backdrop blur. | Rich effects remain; lab frame pacing is still a limitation, not a universal smoothness claim. |
| P2 loading | Google Fonts CSS was loaded through a blocking stylesheet import. One cold baseline sample had a large network outlier. A logo used 144,903 bytes; portrait source used 179,216 bytes. | Nonblocking font stylesheet with immediate system-font fallback and preconnects; 19,300-byte logo variant and 39,846-byte portrait variant with responsive selection. | External fonts can still fail or swap. Full-resolution originals preserved. |
| P2 state/resilience | Repeated timeline activations could overlap Web Animations; gallery image failures gave no contextual recovery. | Cancel prior chapter animations, use coordinated 380/520ms settling; guard repeated modal opens; preserve native focus restoration; show an honest image-failure message beside usable details/source links. | Native dialog support required for enhanced viewers. |
| P2 visual system | Initial palette was improved but hierarchy still relied on many glass surfaces; section rhythm and focus styles varied. | Documented tokens, restrained solid surfaces, consistent spacing, typographic wrapping, CTA hierarchy, readable contribution rules, controlled dialog entrance, touch/focus parity and footer wrapping. | Real project/technology brand colors intentionally preserved. |
| P3 discoverability | Verified canonical/domain existed, but no social preview image was defined. Decorative hero panels added irrelevant headings to the accessibility tree. | Add text-only social card using verified identity/role/location and existing production domain; mark illustrative panels as decorative. | Social-network cache refresh and production indexing are outside local validation. |

## Design and fine-detail inventory

Palette: light paper `#edf7f5`, ink `#102f40`, muted `#496875`, green `#087f68`; dark paper `#081a24`, ink `#e9f7f6`, muted `#a6c4cc`, mint `#67e8bc`. Blue `#1479c9` / `#65b9ff`; focus `#106bb5` / `#85d6ff`. The blue/cyan/emerald gradient is concentrated in the hero emphasis, progress indicators and footer rather than every card. Neutral surfaces separate detailed work from decoration. Existing purple variable names remain compatibility aliases to green; actual project screenshots and brand icons retain authentic colors.

Base solid-text contrasts: light ink 12.79:1, light muted 5.46:1, light green 4.53:1; dark ink 16.14:1, dark muted 9.62:1, dark mint 11.70:1 against their paper tokens. These are token-pair checks, not certification of every translucent or branded element.

Reviewed component types: wordmark/header/nav and contact action; hero headline/introduction/status/clock/process controls; primary work CTA and résumé actions; approach statement; trusted-logo strip and pause control; project picker, arrows, dots, captures, cards, contribution text and tags; directory disclosure and source links; timeline rail/progress/chapter visuals; engagement cards; contract rows and attribution; portrait preview/certificate viewer; tool filters, result announcement and technology cards; contact/footer; project modal toolbar, gallery, facts, contribution and links; theme/motion preferences and focus/disabled states.

Motion vocabulary: 160ms feedback, 280ms component transitions, 520ms larger settling with `cubic-bezier(.22,1,.36,1)`. Timeline copy uses 380ms and artwork 520ms; interrupted animations cancel. Reduced motion disables CSS motion and JS entrances. Offscreen and hidden-tab effects pause. Save-Data simplifies optional hero/portrait/toolbox decoration and blur, without hiding content. No synthetic device benchmark or new settings panel was added; the existing motion control is sufficient.

Authentic portrait, degree text, Amharic lettering, project imagery, contribution attribution and public contract caveats were retained. No new cultural symbolism, client outcomes, credentials or images of the person were invented.

## Verification commands

Use a Node runtime supported by the installed Playwright (Node 20+), Chrome, and an existing Playwright installation; no project dependency installation is required.

- `node --check app.js`, `node --check header.js`, `node --check theme.js`, and test scripts.
- `git diff --check`.
- `NODE_PATH=/path/to/node_modules node tests/browser.cjs` — existing five-viewport regression suite.
- `NODE_PATH=/path/to/node_modules node tests/refinement.cjs` — seven-width, keyboard/focus, themes, live motion preferences, rotation and resilience coverage. `--resilience-only` reruns just failure paths.
- `NODE_PATH=/path/to/node_modules node tests/performance.cjs /tmp/portfolio-measurements.json` — reproducible Chrome/CDP lab workload.

## Three complementary verification passes

1. **Functional/technical:** existing suite passed **244 checks**, including all 29 viewers, carousel wrap, portrait views, filters, theme persistence, compact timeline, project deep links, local resources and runtime errors. Additional layout/interaction checks passed at 320, 375, 390, 768, 1024, 1440 and 1920px, in both themes, with 29 dialog/focus cycles per width, keyboard activation and landscape resizing. No horizontal overflow/page errors in those checks. A no-script defect was fixed; affected no-script, image-failure and denied-storage paths passed separately, and the complete seven-width refinement suite passed again after the deferred-directory correction. Syntax and diff checks passed.
2. **Visual/content/motion/accessibility:** screenshots reviewed for both themes and hero, work, timeline, portrait/about, toolbox, footer and project dialog at desktop/mobile sizes. Screenshot capture now waits for images to decode and aligns sections deliberately. Original screenshots contained real product branding and references; those remain unchanged. Native controls, focus visibility, restored dialog focus, motion changes and token contrasts checked. No formal WCAG certification or screen-reader hardware testing claimed.
3. **Performance/resilience/regression:** before/after measurements use the same script and twelve samples (three fresh browser contexts in each mode, cold and warm). Data below. No real-device, field INP, field conversion/engagement, GPU trace, screen-reader audit or universal hardware claim is made. Asset and script failure behavior is tested rather than simulated success. Native browser background visibility handling is implemented; the headless browser kept tabs visible during the attempted background/resume check, so this path remains unverified. Save-Data behavior, native vertical scrolling over the carousel, and stable DOM size after 100 repeated dialog cycles passed. Prolonged real-device suspend/resume and memory profiling need further hardware testing.

## Performance measurements

Measured on the same Chrome/Playwright CDP workload, with no parallel test browsers: three fresh contexts per mode, cold then warm cache, 1.8 seconds of initial settling, 18 animation-frame full-page scroll positions, and ten synchronous project-dialog open/close cycles. Desktop: 1440×900 without throttling. Constrained: 390×844, 4× CPU slowdown, 80ms latency, 200,000 bytes/s download and 100,000 bytes/s upload. These are lab samples on a shared desktop, not physical-phone or field measurements. The warm run scroll position is reset after navigation. Byte totals cover the complete workload rather than only above-the-fold content.

Medians of three samples per cell:

| Condition | Metric | Before | After |
| --- | --- | ---: | ---: |
| desktop / cold | LCP (ms) | 2680.000 | 996.000 |
| desktop / cold | Load event (ms) | 3214.700 | 2031.600 |
| desktop / cold | CLS | 0.009 | 0.005 |
| desktop / cold | Long-task total (ms) | 744.000 | 985.000 |
| desktop / cold | Scroll script (ms) | 49.616 | 33.925 |
| desktop / cold | Scroll layout (ms) | 25.373 | 36.155 |
| desktop / cold | Frame p95 (ms) | 483.300 | 449.900 |
| desktop / cold | Dialog synchronous cycle (ms) | 21.790 | 18.330 |
| desktop / cold | Bytes over entire workload | 796751.000 | 701275.000 |
| desktop / cold | Heap snapshot (bytes) | 1058308.000 | 1084200.000 |
| desktop / warm | LCP (ms) | 1092.000 | 1076.000 |
| desktop / warm | Load event (ms) | 766.000 | 779.300 |
| desktop / warm | CLS | 0.000 | 0.000 |
| desktop / warm | Long-task total (ms) | 475.000 | 430.000 |
| desktop / warm | Scroll script (ms) | 31.188 | 25.594 |
| desktop / warm | Scroll layout (ms) | 20.391 | 21.315 |
| desktop / warm | Frame p95 (ms) | 566.500 | 433.300 |
| desktop / warm | Dialog synchronous cycle (ms) | 17.640 | 17.550 |
| desktop / warm | Bytes over entire workload | 0.000 | 0.000 |
| desktop / warm | Heap snapshot (bytes) | 1299876.000 | 1997420.000 |
| constrained / cold | LCP (ms) | 3460.000 | 2424.000 |
| constrained / cold | Load event (ms) | 7668.500 | 9464.900 |
| constrained / cold | CLS | 0.001 | 0.001 |
| constrained / cold | Long-task total (ms) | 2096.000 | 3210.000 |
| constrained / cold | Scroll script (ms) | 203.869 | 131.255 |
| constrained / cold | Scroll layout (ms) | 130.429 | 148.891 |
| constrained / cold | Frame p95 (ms) | 566.700 | 383.300 |
| constrained / cold | Dialog synchronous cycle (ms) | 99.260 | 108.320 |
| constrained / cold | Bytes over entire workload | 796751.000 | 701275.000 |
| constrained / cold | Heap snapshot (bytes) | 1042804.000 | 1070104.000 |
| constrained / warm | LCP (ms) | 2188.000 | 2116.000 |
| constrained / warm | Load event (ms) | 3768.800 | 3798.800 |
| constrained / warm | CLS | 0.000 | 0.000 |
| constrained / warm | Long-task total (ms) | 2157.000 | 2732.000 |
| constrained / warm | Scroll script (ms) | 163.302 | 111.134 |
| constrained / warm | Scroll layout (ms) | 122.544 | 100.783 |
| constrained / warm | Frame p95 (ms) | 483.400 | 416.600 |
| constrained / warm | Dialog synchronous cycle (ms) | 107.230 | 91.260 |
| constrained / warm | Bytes over entire workload | 0.000 | 105.000 |
| constrained / warm | Heap snapshot (bytes) | 1298316.000 | 1338208.000 |

Interpretation after the directory correction: cold workload transfer fell from 796,751 to 701,275 bytes (**12.0%**). Median cold LCP fell from 2680 to 996ms desktop and 3460 to 2424ms constrained. Median cold scroll script time fell from 49.62 to 33.92ms desktop and 203.87 to 131.25ms constrained. Frame-p95 medians improved in these samples but remain extremely poor in absolute terms and must not be called smooth on real hardware. Constrained warm dialog cycles improved from 107.23 to 91.26ms, while constrained cold cycles worsened from 99.26 to 108.32ms. Desktop cold load event improved from 3214.7 to 2031.6ms; constrained cold load event worsened from 7668.5 to 9464.9ms, with after-samples ranging from 7565 to 22845ms. Cold long-task totals increased from 744 to 985ms desktop and 2096 to 3210ms constrained. These regressions remain disclosed; this release does **not** meet a claim of across-the-board performance improvement.

The final initial DOM contains 2433 nodes versus 2364 before (the first after-pass had 2693). The remaining new contribution presentation and interaction/state styling add work; asynchronous external fonts and a shared rendering environment also introduce variability. Exact attribution of every residual long task needs a deeper production/real-device trace. Earlier content visibility and complete, useful fallback content are retained rather than deleting functionality to improve a score. Heap snapshots vary with garbage collection and are not a leak verdict. No field INP, guaranteed 60fps, all-device performance, or conversion/engagement claim is made.

Raw samples are in `performance-before.json` and `performance-after.json`. The baseline includes a 21-second cold desktop load outlier; the final after-pass includes a 22.8-second constrained load outlier. Medians are shown and no outlier was silently deleted. The same benchmark script is checked in. Detailed GPU/compositing traces, long-running memory retention, cold offline startup, first-navigation input-to-paint latency and physical device/network coverage remain unmeasured.


## Residual limitations and factual gaps

- Some imported work has sparse public descriptions and no approved screenshots/results. Existing caveats remain; richer case studies require verified project-specific details and permission for private visuals.
- Some project links are historical/reference or published Upwork records, not live demos. Their labels/caveats are preserved. Third-party availability is not guaranteed.
- No Safari/Firefox, real touch-device, 200% platform text setting, low-end GPU, thermal/battery, offline service-worker, or assistive-technology certification was available.
- No contact backend is introduced. Email opens the visitor's email client; no delivery success is claimed.
- Local timing is lab evidence on a shared desktop, with visible scheduling/network variability. No field metrics exist.


## Investigation of the first after-pass regression

The initial after-pass showed regressions and was not treated as completion. A targeted alternating 3×3 profile compared preserved-before, initial-after, and initial-after with only the directory removed. Root HTML/CSS/JS were fulfilled identically for every variant, external fonts were blocked in every variant, CPU/network limits matched, and assets used the normal local server. This isolates source/rendering work from external font timing; it is not a replacement for the full loading benchmark. An earlier exploratory attempt routed only one variant and was rejected as an unmatched comparison.

Median browser task duration: before 6536ms, initial-after 6986ms, directory-removed 6571ms. Style recalculation: 1246ms, 1679ms, and 1467ms respectively. Layout: 1428ms, 1535ms and 1383ms. Script: 444ms, 530ms and 504ms. This supports the extra initially parsed directory DOM as a reproducible part of the startup tradeoff, while other rendering/font/scheduling costs remain. Raw profiles: `performance-directory-profile.json`.

Correction: keep all 29 records inside native no-script fallback markup, and on JavaScript visits instantiate those same records only on first opening of the native directory. The directory enhancement is isolated from the main application initialization. No records or source links are deleted. Opening the directory incurs its one-time DOM creation cost; subsequent opens reuse it. The final matched loading benchmark is repeated after this correction.


## Publication authorization

The initial improvement request authorized local work only. After reviewing the live preview, the user separately approved publication: “i like it, publish deploy and make it available on live.” That later instruction authorizes the necessary normal commit/push to the existing GitHub Pages workflow. No force push, hosting migration, purchase, analytics or new external communication is required. Deployment status and the actual public page must be verified after pushing.


### Font-policy follow-up and residual performance status

After the directory correction, an alternating three-pair constrained comparison held source fulfillment, CPU/network limits and markup constant while changing only the Google Fonts display policy (`swap` versus `optional`). This did not show a consistent reduction in layout or long-task work. No speculative font-policy change was shipped. Full raw records are in `performance-font-profile.json`. Fonts remain an optional external dependency, and their late loading may trigger a further layout; the site remains readable through system fallbacks.

Performance status: deterministic asset reduction and several lab improvements are verified. The initial directory regression was investigated by controlled ablation and corrected. Residual constrained load/long-task regressions have not been fully eliminated or attributed to a single cause; further production tracing and real low-end device/GPU coverage are needed before claiming the broad performance target is achieved. The user has approved publication of the reviewed design; these limitations remain visible in this audit rather than being represented as an all-green performance result.
