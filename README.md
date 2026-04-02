# LinkedIn Feed Cleaner

A Chrome extension that removes unwanted posts from your LinkedIn feed.

## Features

- Hides **promoted/sponsored posts** from the feed
- Toggle each filter on/off from the extension popup
- Tracks how many posts have been blocked

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder
5. Navigate to [linkedin.com/feed](https://www.linkedin.com/feed) — promoted posts will be hidden automatically

## Usage

Click the extension icon in the Chrome toolbar to open the popup, where you can:

- Toggle filters on or off — changes apply instantly without a page reload
- See how many posts of each type have been blocked
- Reset the counters

## How it works

LinkedIn marks sponsored posts with a "Promoted" label in the feed. The extension detects this label using a `MutationObserver` so it catches posts loaded as you scroll, not just on initial page load. Hidden posts can be restored at any time by toggling the filter off.
