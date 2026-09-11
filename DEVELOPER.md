For installation and everyday use, see [README.md](README.md) or open START-HERE.html.

# Page Notes — Developer reference (1.3.0)

A dependency-free Chrome Manifest V3 extension for turning visual page feedback into actionable Markdown for coding agents.

## Install

End-user installation is in [README.md](README.md). Load the repository root unpacked in Chrome Developer mode — the folder that contains `manifest.json`. That is what GitHub visitors download. A local `dist/page-notes` package is optional for maintainers.

No account, API key, or server is required. The runtime extension has no npm dependencies; Node is used only for tests, version stamping, and the distributable build.

## Versioning and build

`package.json` is the canonical version. `node scripts/build.cjs` stamps that version into `manifest.json` and the docs, then writes:

- `dist/page-notes/` and `dist/page-notes-<version>.zip` for optional unpacked sharing. GitHub visitors install from the repository root, not this zip.
- `dist/chrome-web-store/page-notes-<version>.zip` for Chrome Web Store upload. `manifest.json` is at the zip root; developer docs are omitted.
- `dist/chrome-web-store/page-notes-<version>.crx`, a CRX3 of that same store package, plus a JSON sidecar with the extension id.

The first CRX build writes `keys/page-notes.pem` (gitignored). Back it up; it pins the CRX id. CI uses `PAGE_NOTES_PEM` when that secret is set, otherwise it signs with an ephemeral key.

```
node --test tests/unit.cjs
node scripts/build.cjs
```

Bump and restamp without building:

```
node scripts/version.cjs patch    # also minor, major, or 1.4.0
node scripts/version.cjs --stamp  # rewrite versioned files from package.json
```

`npm start` (or `npm run preview`) serves the current version at `http://127.0.0.1:8765/`. That sample page is for pointing with a loaded unpacked extension. `http://127.0.0.1:8765/preview` injects the latest `content.js` with mock storage. Use `--no-open` to skip launching a browser. `PORT` overrides the port.

## Workflow

1. Open a website, click the extension, then **Point at this page**. Pointing starts automatically.
2. Hover to highlight (visible text, not the tag). **Alt-scroll** walks the DOM parent/child chain. Click to pin. Continue clicking to create a multi-element group. Click a selected element again to remove it. Drag a rectangle to mark empty space.
3. Write the instruction in the on-page composer. Optional per-element notes stay behind **Element note**. **Add note** or Ctrl/⌘+Enter queues the group and captures the viewport.
4. Repeat. Queued copy edits ghost the proposed text over the original. The dock is a map: rename the review, edit, locate, retry screenshots, or remove from **More**.
5. **Copy for Cursor** copies Markdown and downloads the packet ZIP when screenshots exist. **Review packet** opens Copy for Cursor, Download packet, and Markdown-only under More formats.
6. Groups auto-save to the local backlog under the review name. **Save review** writes immediately. **New review** starts a separate entry.

The panel minimizes while you write on the page; **Resume notes** reopens the map. Close removes all controls and highlights while preserving the draft. Reopen from the extension toolbar. Switching away from the inspected tab also disengages Page Notes; returning to the tab does not reactivate it. Escape cancels an open on-page note first, then finishes pointing, then closes. The standalone backlog manager remains open across tab switches.

When upgrading, replace the files in the existing extension directory, reload the extension at `chrome://extensions`, then refresh **all previously inspected webpage tabs** once to remove content scripts injected by the old version. Future sessions include context-invalidation cleanup and tab-local lifecycle handling.

## Quick inline copy edits

While pointing is active, double-click a heading, paragraph, link, or button label. A text editor appears over the element with its current copy selected. Type the replacement, then choose **Add copy edit** or press **Ctrl/⌘ + Enter**. A separate copy-only group is queued with the same captured element ID, XPath, CSS selector, coordinates, and a screenshot of the original page. Existing multi-selections are preserved.

The editor is an overlay; it does not modify the website's DOM or submit anything. Escape or Cancel discards uncommitted text. Leaving the tab or closing Page Notes also cancels the inline editor; queue the edit before leaving. Queued copy edits persist like other groups and can be revised with the group's Edit action and Replacement copy field.

Markdown includes exactly `Replace Copy with 'your replacement text'` for each copy edit. JSON evidence retains both the full original and replacement text. Line breaks, apostrophes, literal markup, and intentional empty replacements are preserved. Markup is treated as text. No-change edits are rejected. Form fields and non-text elements are excluded; select a smaller element if its text exceeds 20,000 characters.

## Compact interface

The panel is 370px wide. Capture happens on the page: an anchored composer, numbered pins, and copy ghosts. The dock is a map of notes with a review name, screenshot thumbs, and a Retry state when capture failed. **Copy for Cursor** is the primary handoff; Review packet holds the Markdown preview, packet ZIP, and Markdown-only overflow.

## Screenshots and compact feedback

The Markdown leads with your group instruction, element comments, screenshot references, and small coordinate tables. Full CSS selectors, XPath, original click coordinates, and identifying metadata live in `evidence.json`. Image annotations numbered 1, 2, etc. match the ordered elements within each group.

Each newly queued group automatically captures the current viewport. Use **Add screenshot** on a queued group to capture another view after scrolling. Screenshots are shown in the queue and can be individually removed. Off-screen, partial, and missing elements are explicitly identified in each view's evidence. Geometry does not detect occlusion by another page element. The coordinate table reports the element's upper-left corner and size at screenshot time; original click coordinates remain in the evidence JSON.

The panel and temporary hover highlights are hidden during capture. Green numbered outlines are drawn into the image afterward. Capture rejects a tab switch, scroll, resize, or route change during capture. Keep the inspected tab active and still. Animated content can still move between the geometry read and capture.

Capture failures preserve the group and display the reason. Capture is only available on the original page, not in the backlog manager. Comment-only edits preserve images; changing group membership discards old views and captures a new one so numbering remains consistent. For a group created by an older extension version, use Add screenshot to attach an image.

Screenshots are JPEGs limited to 1800 pixels wide, with actual image-to-CSS scale recorded in JSON. They are saved with drafts and backlog entries in the existing local storage quota. Large backlogs can reach Chrome's quota; errors are surfaced, and exported ZIPs provide a portable copy. Screenshots include all visible page content, not just selected elements; review previews before sharing. No new permissions are required.

## Captured evidence

Each element includes:

- Absolute namespace-aware XPath for ordinary document elements, plus a CSS selector.
- Shadow host CSS chain and a root-relative CSS selector for elements in open Shadow DOM. XPath is explicitly null for these elements.
- Click position in viewport and document coordinates.
- Element bounds in viewport and document coordinates, scroll offset, viewport dimensions, and device pixel ratio.
- Capture timestamp, page URL and title, tag, up to 600 characters of text, selected identifying attributes, and user comments.

Coordinates use CSS pixels. The Markdown explains how the agent should resolve and validate the target, interpret the comments, and distinguish page evidence from user instructions. It does not invoke an LLM itself.

## Local persistence and permissions

Backlog entries use `chrome.storage.local`, independently keyed by session ID. They survive browser restarts. They are not synced between profiles or devices. Uninstalling the extension removes its stored data; export important work first.

Working drafts are scoped to a tab and its URL, including unfinished selections and comments. They survive page reloads in that tab. Closing the tab removes its drafts; save to backlog for durable retention. Drafts are not intended as browser-restart recovery. Changing a SPA route requires a new session for new captures.

Only `activeTab`, `scripting`, `storage`, and `clipboardWrite` permissions are requested. Injection happens after you activate inspection, following Chrome's activeTab/scripting model. There are no remote scripts, analytics, cloud requests, or dependencies. Page text, URLs (including query parameters), and comments you choose to capture are included in the local export; review the Markdown preview before sharing it.

API references: https://developer.chrome.com/docs/extensions/reference/api/scripting and https://developer.chrome.com/docs/extensions/reference/api/storage

## Scope and limitations

- Desktop Chrome only. Chrome internal pages, the Chrome Web Store, and other browser-protected documents cannot be inspected. Local file pages require enabling “Allow access to file URLs” in extension details.
- This version selects elements in the top document and open Shadow DOM. It can select an iframe element, but not elements inside the iframe. Closed shadow roots and canvas internals cannot be inspected.
- XPath/CSS locators describe the DOM at capture time; regenerated IDs or changed structure may invalidate them. “Locate” is a best-effort convenience; agents should verify targets before editing.
- No full-page screenshot stitching, DOM editing, cloud backlog, or automatic code changes are included. Multi-selection is click-to-toggle and requires no modifier key. Empty-space notes are drag-rectangles stored as bounds, not fake selectors.
- Captured bounds remain a historical snapshot. Visible highlights follow scrolling and viewport resize; continuous page animation may outpace highlights.
- The panel is visually isolated with Shadow DOM but shares the page DOM. A hostile page can still remove or obscure it. Unusually aggressive site event handlers may interfere with capture.
- Storage quota failures and clipboard failures are surfaced in the panel. For clipboard restrictions, use Download or manually copy the preview.

## Files and development

- `package.json`: canonical version and npm script aliases.
- `scripts/build.cjs` / `scripts/version.cjs`: unpacked zip, Chrome Web Store zip/CRX, and version stamps.
- `keys/page-notes.pem`: CRX signing key, created on first store build and gitignored.
- `manifest.json`: permissions and extension entry points.
- `background.js`: serialized draft/backlog storage operations.
- `popup.html` / `popup.js`: activation and backlog launcher.
- `content.js`: isolated panel, selection, queue, and export UI.
- `core.js`: locators, capture schema, and Markdown serialization.
- `lifecycle.js`: tab-local open/minimize/close/selection state.
- `backlog.html`: full-page backlog manager.
- `branding/`: announcement artwork; omitted from `dist/`.
- `scripts/preview.cjs`: local sample page and mock-panel server.
- `tests/sample.html` / `tests/preview.html`: local test pages; preview injects the panel with mock storage.
- `tests/smoke.cjs`: browser integration test.

To run the browser smoke test, install Playwright in your development environment and its Chromium browser, then run `node tests/smoke.cjs` with Playwright available to Node. It copies the same shippable files as the dist package and grants the disposable copy all-URLs host permission for screenshot capture to simulate the user's toolbar access grant; the shipped manifest retains activeTab-only access.

## Validation in this delivery

JavaScript syntax checks and Node tests (`node --test tests/unit.cjs`) cover compact Markdown, full JSON evidence, ZIP extraction/checksums using Python, concurrent backlog updates, draft isolation and cleanup, storage error recovery, manifest entry points, screenshot coordinate scaling, capture throttling, inactive/switched-tab protection, close/minimize behavior, independent tab state, Escape behavior, repeated activation, copy-edit identifier preservation, exact instruction export, empty/multiline/literal replacement text, version stamps, the dist package contents, the Chrome Web Store zip layout, CRX3 packing, and the local preview server. Chrome storage and screenshot/canvas APIs are mocked in these Node tests; image rendering is not visually verified by them.

Full browser integration and visual verification remain pending: the available browser security policy blocks the local test fixture. Lifecycle regressions were verified against the production state module in Node, not through live tab interaction. `tests/smoke.cjs` is provided for local execution. `npm start` serves `tests/sample.html` for unpacked-extension testing; `/preview` is the mock-storage UI fixture and reports screenshot capture unavailable outside the installed extension.
