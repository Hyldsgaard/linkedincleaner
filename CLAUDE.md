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
  filters: { promoted: true, suggested: true, recommended: true, activity: false },
  counts:  { promoted: 0, suggested: 0, recommended: 0, activity: 0 }
}
```

### How LinkedIn posts are detected

LinkedIn uses obfuscated/hashed CSS classes that change on every deploy. Detection relies on stable semantic markers only:

- Feed container: `[data-testid="mainFeed"]`
- Individual posts: `[role="listitem"]` descendants of the feed
- **Single-label filters** (`FILTER_MAP` in `content.js`): exact text node match — `"Promoted"`, `"Suggested"`, `"Recommended for you"`
- **Activity filter**: text node ending with one of the `ACTIVITY_PHRASES` — `"likes this"`, `"commented on this"`, `"reposted this"`, `"celebrates this"`, `"loves this"`, `"supports this"`, `"finds this funny"`, `"finds this insightful"`

Posts are hidden by setting a `data-linkedin-*` attribute on both the `[role="listitem"]` and its nearest ancestor that is a direct child of the feed container. Both are targeted by an injected `<style>` tag (`display: none !important`), which eliminates layout gaps and survives React re-renders.

### Adding a new filter type

For a single-label filter (e.g. a new LinkedIn label):
1. Add an entry to `FILTER_MAP` in `content.js`
2. Add the key to `DEFAULTS.filters/counts` in both `content.js` and `popup.js`
3. Add a CSS rule in the injected `<style>` block in `content.js`
4. Add a toggle row in `popup.html` and the key to the `FILTERS` array in `popup.js`

For an activity-phrase filter, add the phrase to `ACTIVITY_PHRASES` in `content.js`.
