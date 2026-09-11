# Page Notes — Start here

**Point at a webpage. Add feedback. Export it for your AI coding assistant.**

Page Notes lets you select parts of a website, add comments, suggest new wording, and save annotated screenshots. It prepares feedback; it does not change the website for you.

This GitHub repository **is** the installable extension. Load the downloaded folder in Chrome Developer mode. You do not need the Chrome Web Store, an account, or an API key.

**Prefer a webpage-style guide?** After you download the folder, open `START-HERE.html` in a browser.

## 1. Get the folder ready

Use Google Chrome on a **Mac or Windows computer**. These instructions do not work in Chrome on a phone or tablet.

1. Open [npuxdev/page-notes](https://github.com/npuxdev/page-notes). Click **Code**, then **Download ZIP**.
2. Unzip it:
   - **Mac:** double-click the ZIP file in Finder.
   - **Windows:** right-click the ZIP file, choose **Extract All**, then **Extract**.
3. You should have a folder named **page-notes-main** (GitHub adds `-main` to the download). Open it.
4. Confirm you see **manifest.json**. Chrome needs these files in that same folder (do not move them into subfolders):
   - `manifest.json`
   - `background.js`
   - `popup.html` and `popup.js`
   - `backlog.html`
   - `content.js`, `core.js`, and `lifecycle.js`
   - `icons/icon-16.png`, `icon-32.png`, `icon-48.png`, and `icon-128.png`
5. Move **page-notes-main** somewhere you will keep it, such as your **Documents** folder.

If you use Git, `git clone https://github.com/npuxdev/page-notes.git` and install from the **page-notes** folder instead. It contains the same files.

**Keep this folder in place after installing. Chrome uses it to run Page Notes.** You can delete the downloaded ZIP afterward, but keep the extracted folder.

If any of the files above are missing, download the ZIP again from GitHub. Do not load a feedback-export ZIP (those contain `feedback.md` and screenshots, not the extension).

## 2. Add Page Notes to Chrome

1. Open Google Chrome.
2. Click the address bar at the top, type **chrome://extensions**, and press **Enter**. Type it into the address bar, not a search box on a webpage.
3. Turn on **Developer mode** in the upper-right corner. This is simply the setting Chrome uses to load an extension from a folder.
4. Click **Load unpacked**, near the upper-left corner.
5. Find and select the folder you placed in Documents (**page-notes-main** from the GitHub ZIP, or **page-notes** if you cloned). Choose **Select Folder** or **Open**, depending on your computer. Select the folder that contains **manifest.json**, not the ZIP file.
6. A card named **Page Notes — Feedback for Agents** should appear. Make sure its on/off switch is on.
7. Click the **puzzle-piece icon** beside Chrome's address bar. Find **Page Notes** and click its **pin** so the mint page-and-cursor icon stays in your toolbar.

**You're installed.** Open an ordinary website, click the Page Notes icon, then choose **Point at this page**.

## 3. Make your first note

1. On the website, open Page Notes. Pointing is already on.
2. Move your mouse over the page. The highlight uses the visible text, not the HTML tag. Hold **Alt** and scroll to move the target up or down the page structure if the wrong item is highlighted.
3. Click the text, button, or other item you want to comment on. A note field appears on the page. Click additional items to discuss them together; click again to deselect.
4. Type what should change. For example: “Make these two buttons the same width.” Press **Command + Enter** on Mac / **Ctrl + Enter** on Windows, or click **Add note**.
5. Repeat for any additional feedback. Drag on empty space to mark where something is missing.

Name the review at the top of the panel if you want something clearer than the page title. Notes are saved to this Chrome profile as you add them.

Click **Element note** on a pin to comment about one particular item. If a screenshot is missing, use **Retry screenshot** on that note. To capture another part of a long page, scroll there and click **Add screenshot**.

Keep the webpage still and active while a screenshot is being taken. A screenshot covers the visible part of the page, not the entire page.

## 4. Suggest different wording quickly

1. With pointing on, **double-click** a heading, paragraph, link, or button label.
2. Type your replacement text into the editor that appears over it.
3. Click **Add copy edit**, or press **Command + Enter** on Mac / **Ctrl + Enter** on Windows.

The edit is queued with an instruction such as **Replace Copy with 'Start your free trial'**. The actual website remains unchanged. The proposed copy is shown as a ghost on the original text so you can review it.

**Cancel** or **Esc** discards text that has not been queued. Switching tabs also cancels an open copy editor, so add the copy edit before leaving the tab.

## 5. Send your feedback or keep it for later

### Send it to an AI coding assistant

1. Finish adding your notes.
2. Click **Copy for Cursor**. This copies the written instructions. If there are screenshots, Page Notes also downloads a packet ZIP.
3. Paste into your assistant. Attach the ZIP (or its `feedback.md`, `evidence.json`, and `screenshots` folder) when the assistant needs images and locators.

**Review packet** opens a preview. **Download packet** is the complete ZIP. **Markdown only** is under More formats and does not include images.

### Keep it on this computer

Notes are saved to the backlog as you add them. Click the toolbar icon and choose **Open saved backlog**, then **Open session** on the review you want. You can also click **Save review**.

Saving an opened review updates that saved item. **New review** starts a separate one. If asked to replace a queue, export anything extra you want to keep first.

Saved reviews stay in this Chrome profile. They do not sync to another computer. Closing Page Notes keeps your working draft, but **closing the webpage tab deletes its unsaved draft**. Named reviews in the backlog survive quitting Chrome.

## 6. Close or hide the panel

- The panel hides while you write on the page. Click **Resume notes** to reopen the map of notes, send to your agent, or rename the review.
- The close button removes Page Notes from the page. Reopen it from Chrome's toolbar.
- Switching to another tab disengages inspection. When you return, click the toolbar icon to resume.
- **Esc** finishes selection; pressing it again closes the panel.

## 7. Install an update

Updates are manual for this preview.

1. In the current version, save or export feedback you want to keep.
2. Download a fresh ZIP from GitHub (**Code** → **Download ZIP**) and unzip it into a temporary location, such as Downloads.
3. Open the new folder (**page-notes-main**). Copy everything **inside** it.
4. Open the **existing folder you originally installed**, such as Documents/page-notes-main. Paste the copied files there and choose **Replace** when asked. Keep the existing folder in the same place. Do not put the new folder inside the old one.
5. In Chrome, go to **chrome://extensions**.
6. Find the Page Notes card and click its **Reload** button (a circular arrow).
7. Refresh every webpage where you had Page Notes open. This clears the old version's controls.

Do not click **Remove** to update. Removing the extension deletes its saved backlog. Replacing files in the same folder and reloading is the intended update method.

## If something doesn't work

| What you see | What to do |
| --- | --- |
| “Manifest file is missing” or the folder will not load | Unzip the GitHub download first. Choose the folder that contains **manifest.json** (usually **page-notes-main**). If you only see `feedback.md` or screenshots, that is an exported review, not the extension. |
| No Developer mode or Load unpacked option | Make sure you are on **chrome://extensions** in desktop Google Chrome. A work-managed computer may block this installation method; ask your administrator. |
| Page Notes is missing from the toolbar | Click Chrome's puzzle-piece icon and pin Page Notes. |
| Chrome cannot inspect this page | Try an ordinary website. Chrome settings pages, the Chrome Web Store, and some protected pages cannot be inspected. |
| The panel or a floating control seems stuck after an update | Reload Page Notes on **chrome://extensions**, then refresh the affected webpage. |
| A screenshot was not captured | Keep the inspected tab active, scroll a selected item into view, wait a moment, then click **Add screenshot**. Your queued comment is still there. |
| Copying does not work | Use **Download ZIP** instead, or expand Preview Markdown and select the text manually. |
| Your browser reports the extension folder is missing | Check that you have not moved or deleted the installed page-notes folder. Restore it to its original location. |
| A note you made is missing | Open **Backlog**. Unsaved drafts are only kept while their webpage tab remains open. |
| Saving reports a storage error | Download a ZIP backup first. Once you have checked your exports, remove older saved sessions you no longer need. |

Still stuck? Open an issue on [npuxdev/page-notes](https://github.com/npuxdev/page-notes) with a screenshot of the error, your operating system (Mac or Windows), and the Page Notes version shown on **chrome://extensions**.

## Privacy and preview status

Page Notes stores feedback locally and does not send it to an AI service. You choose what to export and share. Screenshots include everything visible on the page; check them before sharing private information. Uninstalling Page Notes removes its local backlog, so export anything important first.

This is **preview version 1.3.0**. Automated checks have passed, but full live-browser and visual testing remains pending. Report anything that behaves unexpectedly. Some embedded page sections and protected content cannot be inspected.

## Sharing this preview

Share the repository: [npuxdev/page-notes](https://github.com/npuxdev/page-notes). Recipients should download the ZIP from **Code** and start with this guide or **START-HERE.html**. Do not send a feedback-export ZIP as the installer. Your feedback is stored in Chrome, not in the extension folder.

For source-code details and testing notes, see **DEVELOPER.md**.

Installation steps follow [Google's Chrome extension guide](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
