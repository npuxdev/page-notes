For installation and everyday use, see [README.md](README.md) or open START-HERE.html.

# Page Notes — Developer reference (1.2.1)

A dependency-free Chrome Manifest V3 extension for turning visual page feedback into actionable Markdown for coding agents.

## Install

1. Extract the ZIP into a permanent folder.
2. Open `chrome://extensions` in desktop Chrome.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the `page-notes` folder containing `manifest.json`.
5. Pin **Page Notes** from the toolbar's Extensions menu.

No build step, account, API key, or server is required.

## Workflow

1. Open a website, click the extension, then **Inspect this page**.
2. Choose **Select elements**. Hover to highlight; click to select. Continue clicking to create a multi-element group. Click a selected element again to remove it.
3. Choose **Finish selecting** or press Escape. Add a group instruction and optional individual element comments.
4. Choose **Add group to queue**. The extension captures the current viewport with numbered element outlines while hiding its panel. Repeat for additional groups. Each group can be edited, located, or removed.
5. Choose **Export feedback**, then **Download ZIP** for `feedback.md`, `evidence.json`, and annotated JPEG images. **Copy Markdown** and **MD only** keep the readable text and image references; attach the ZIP separately to provide the images and full selectors.
6. Alternatively, choose **Save to backlog**. Open saved sessions from the panel's Backlog tab or the extension popup. Saving an opened session updates it; **New session** creates a separate entry.

Use **−** to temporarily minimize while selecting behind the panel; **Resume notes** reopens it. **×** closes Page Notes completely, removing all controls and highlights while preserving the draft. Reopen from the extension toolbar. Switching away from the inspected tab also disengages Page Notes; returning to the tab does not reactivate it. Escape finishes selection first; a second Escape closes the panel. Page interactions resume whenever selection ends. The standalone backlog manager remains open across tab switches.

When upgrading, replace the files in the existing extension directory, reload the extension at `chrome://extensions`, then refresh **all previously inspected webpage tabs** once to remove content scripts injected by the old version. Future sessions include context-invalidation cleanup and tab-local lifecycle handling.

## Quick inline copy edits

While **Select elements** is active, double-click a heading, paragraph, link, or button label. A text editor appears over the element with its current copy selected. Type the replacement, then choose **Add copy edit** or press **Ctrl/⌘ + Enter**. A separate copy-only group is queued with the same captured element ID, XPath, CSS selector, coordinates, and a screenshot of the original page. Existing multi-selections are preserved.

The editor is an overlay; it does not modify the website's DOM or submit anything. Escape or Cancel discards uncommitted text. Leaving the tab or closing Page Notes also cancels the inline editor; queue the edit before leaving. Queued copy edits persist like other groups and can be revised with the group's Edit action and Replacement copy field.

Markdown includes exactly `Replace Copy with 'your replacement text'` for each copy edit. JSON evidence retains both the full original and replacement text. Line breaks, apostrophes, literal markup, and intentional empty replacements are preserved. Markup is treated as text. No-change edits are rejected. Form fields and non-text elements are excluded; select a smaller element if its text exceeds 20,000 characters.

## Compact interface

The panel is 370px wide with reduced header and card spacing. Group comments appear when elements are selected. Optional element notes and screenshot previews are collapsible. Long locators are available as hover titles instead of filling selection cards. Export opens a focused view with Copy MD, Download ZIP, MD only, and an optional Markdown preview; Back to queue returns to editing.

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
- No full-page screenshot stitching, DOM editing, drag rectangles, cloud backlog, or automatic code changes are included. Multi-selection is click-to-toggle and requires no modifier key.
- Captured bounds remain a historical snapshot. Visible highlights follow scrolling and viewport resize; continuous page animation may outpace highlights.
- The panel is visually isolated with Shadow DOM but shares the page DOM. A hostile page can still remove or obscure it. Unusually aggressive site event handlers may interfere with capture.
- Storage quota failures and clipboard failures are surfaced in the panel. For clipboard restrictions, use Download or manually copy the preview.

## Files and development

- `manifest.json`: permissions and extension entry points.
- `background.js`: serialized draft/backlog storage operations.
- `popup.html` / `popup.js`: activation and backlog launcher.
- `content.js`: isolated panel, selection, queue, and export UI.
- `core.js`: locators, capture schema, and Markdown serialization.
- `lifecycle.js`: tab-local open/minimize/close/selection state.
- `backlog.html`: full-page backlog manager.
- `tests/smoke.cjs`: browser integration test.

To run the test, install Playwright in your development environment and its Chromium browser, then run `node tests/smoke.cjs` with Playwright available to Node. It uses a disposable copy with all-URLs test host permission for screenshot capture to simulate the user's toolbar access grant; the shipped manifest retains activeTab-only access.

## Validation in this delivery

JavaScript syntax checks and all 15 Node tests passed (`node --test tests/unit.cjs`). Tests cover compact Markdown, full JSON evidence, ZIP extraction/checksums using Python, concurrent backlog updates, draft isolation and cleanup, storage error recovery, manifest entry points, screenshot coordinate scaling, capture throttling, inactive/switched-tab protection, close/minimize behavior, independent tab state, Escape behavior, repeated activation, copy-edit identifier preservation, exact instruction export, and empty/multiline/literal replacement text. Chrome storage and screenshot/canvas APIs are mocked in these Node tests; image rendering is not visually verified by them.

Full browser integration and visual verification remain pending: the available browser security policy blocks the local test fixture. Lifecycle regressions were verified against the production state module in Node, not through live tab interaction. `tests/smoke.cjs` is provided for local execution. `tests/preview.html` is a development-only UI fixture with mock storage; it deliberately reports screenshot capture unavailable outside the installed extension.
