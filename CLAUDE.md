# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Chrome extension (Manifest V3) that hides unwanted post types from the LinkedIn feed. No build step — files are loaded directly by Chrome.

## Loading the extension

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select this folder
4. After any code change, click the reload icon on the extension card, then reload the LinkedIn tab

## Architecture

There are three execution contexts that communicate via `chrome.storage.local`:

- **`content.js`** — injected into `https://www.linkedin.com/feed/*`. Reads `filters` from storage to know what to hide, uses a `MutationObserver` on `document.body` to catch posts loaded on scroll, and writes to `counts` in storage when a post is hidden.
- **`popup.js`** / **`popup.html`** — the dropdown shown when clicking the icon. Renders toggle switches and counts from storage; writes `filters` back to storage when toggled. Changes are picked up immediately by `content.js` via `chrome.storage.onChanged`.
- **`background.js`** — minimal service worker, currently a placeholder (badge display was intentionally removed).

### Storage schema

```js
{
  filters: { promoted: true },   // true = hide that post type
  counts:  { promoted: 0 }       // lifetime blocked count per type
}
```

### How LinkedIn posts are detected

LinkedIn uses obfuscated/hashed CSS classes that change on every deploy. Detection relies on stable semantic markers only:

- Feed container: `[data-testid="mainFeed"]`
- Individual posts: `[role="listitem"]` descendants of the feed
- Promoted posts: a text node with exact content `"Promoted"` somewhere inside the listitem

Posts are hidden by setting a `data-linkedin-promoted` attribute, which is targeted by an injected `<style>` tag (`display: none !important`). This survives React re-renders better than inline `style` changes.

### Adding a new filter type

1. Add a key to `DEFAULTS.filters` and `DEFAULTS.counts` in both `content.js` and `popup.js`
2. Add detection logic in `applyFilters()` in `content.js` (follow the promoted posts pattern)
3. Add a toggle row in `popup.html` and wire it up in `popup.js`
