# WebMark 🖊️

Highlight text and drop sticky notes on any webpage. Everything saves locally — no account, no backend, no cost.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green?style=flat)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## What it does

- **Highlight text** in 4 colours — select any text on any webpage and a colour picker appears instantly
- **Sticky notes** — double click anywhere to drop a draggable, editable sticky note
- **Note colours** — pick from 4 colours per note
- **Toggle on/off** — disable WebMark entirely from the popup when you don't need it
- **Clear controls** — clear highlights, notes, or everything for the current page from the popup
- **Persists across sessions** — highlights and notes are saved per URL and restored on every visit
- **Works on any website** — Wikipedia, GitHub, news sites, documentation, anywhere

---

## Demo

> Select text → pick a colour → highlight saved forever

---

## Tech stack

| Layer | Tech |
|---|---|
| Extension API | Chrome Manifest V3 |
| Logic | Vanilla JavaScript — no frameworks |
| Storage | `chrome.storage.local` |
| Styling | Plain CSS injected via content scripts |
| DOM manipulation | Range API, TreeWalker, createElement |

---

## Project structure

```
WebMark/
├── manifest.json       # Extension config — permissions, scripts, icons
├── content.js          # Runs on every webpage — highlight + sticky note logic
├── content.css         # Styles injected into every webpage
├── storage.js          # Save/load highlights and notes via chrome.storage
├── background.js       # Service worker — reserved for keyboard shortcuts
├── popup.html          # UI shown when extension icon is clicked
├── popup.js            # Popup logic — toggle, clear buttons
├── popup.css           # Popup styles
└── icons/              # Extension icons (16px, 32px, 128px)
```

---

## How it works

### Highlighting
1. User selects text → `mouseup` event fires → colour picker tooltip appears near cursor
2. User clicks a colour → `Range.surroundContents()` wraps selected text in a `<mark>` element
3. Highlight text and colour saved to `chrome.storage.local` keyed by page URL
4. On page load → `TreeWalker` scans every text node → finds saved text → restores the `<mark>`

### Sticky Notes
1. User double clicks anywhere → sticky note `div` created at click coordinates using `pageX/pageY`
2. Note is draggable via `mousedown` + `mousemove` events on the note header
3. Note content, position and colour saved to `chrome.storage.local` on every change
4. On page load → notes restored at their exact saved positions

### Toggle
1. Popup reads saved `webmark-active` state from `chrome.storage.local`
2. Flipping the toggle saves new state and sends a message to `content.js` via `chrome.tabs.sendMessage`
3. `content.js` updates `webmarkActive` variable — all features gate on this flag instantly

---

## Run locally

No build tools, no npm, no setup. Just load the folder into Chrome.

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/webmark-extension.git
cd webmark-extension
```

**2. Load into Chrome**
- Go to `chrome://extensions`
- Toggle **Developer mode** ON (top right)
- Click **Load unpacked**
- Select the `webmark-extension` folder

**3. Test it**
- Open any website — Wikipedia works great
- Select some text — colour picker appears
- Click a colour — text gets highlighted
- Refresh the page — highlights come back
- Double click anywhere — sticky note appears
- Open the popup — toggle WebMark on/off, clear notes and highlights

No API keys, no environment variables, no servers.

---

## Key concepts used

**Range API** — the browser's way of representing exact start and end positions of a text selection in the DOM. Used to wrap selected text in a `<mark>` element without losing surrounding HTML structure.

**TreeWalker** — a DOM API that traverses every text node in a page one by one. Used to find and re-highlight saved text on page load without requiring the user to reselect anything.

**chrome.storage.local** — extension-owned persistent storage accessible from all extension scripts. Stores highlights as an array and notes as an object, both keyed by page URL.

**Content Scripts** — JavaScript files injected into every webpage the user visits. They have full access to the page DOM and run alongside the page's own scripts in an isolated context.

**chrome.tabs.sendMessage / chrome.runtime.onMessage** — the messaging system between the popup and content scripts. Since they run in separate contexts and can't call each other's functions directly, messages are the bridge.

**Manifest V3** — the current Chrome extension standard. Uses a service worker instead of a persistent background page, stricter security, and declarative APIs.

---

## Roadmap

- [x] Text highlighting with 4 colours
- [x] Colour picker tooltip with fade animation
- [x] Highlights persist across sessions via chrome.storage
- [x] Sticky notes with drag and drop
- [x] Note colour picker
- [x] Notes persist across sessions
- [x] Popup UI with on/off toggle
- [x] Clear highlights / notes / all from popup
- [ ] Eraser tool — remove individual highlights by selecting them
- [ ] Fix complex selections — text spanning multiple HTML elements
- [ ] Keyboard shortcuts — Alt+W toggle, Alt+N new note
- [ ] Export notes as .txt file
- [ ] AI one-line summary of highlighted text (v2)

---

## Known limitations

- Highlighting text that spans across multiple HTML elements (e.g. from a `<p>` into an `<h2>`) is not supported yet — the selection is skipped
- Notes and highlights are stored per exact URL — a page with query parameters is treated as a different page

---

## Contributing

Pull requests welcome. For major changes open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

---

## Why I built this

I built WebMark as a learning project to understand vanilla JavaScript and browser APIs deeply no React, no frameworks, just raw JS. 

Concepts I learned while building it: DOM manipulation, the Range API, TreeWalker, event delegation, drag and drop, Chrome extension architecture, content scripts, chrome.storage, and cross-context messaging between popup and content scripts.

If you're learning JS and want to understand how the browser actually works — building a Chrome extension is one of the best ways to do it.

## License

MIT — do whatever you want with it.

---

*Built by Rohan Sharma — CS student. First Chrome extension, built from scratch in vanilla JS.*
