# LinkedIn Feed Cleaner

A Chrome extension that removes unwanted posts from your LinkedIn feed.

## Features

- Hides **promoted/sponsored posts** from the feed
- Hides **suggested posts** (algorithmic recommendations)
- Hides **"Recommended for you"** people/connection suggestions
- Hides **connection activity posts** (when someone likes, comments, or reacts to a stranger's post) — off by default
- Toggle each filter on/off from the extension popup
- Tracks how many posts of each type have been blocked

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder
5. Navigate to [linkedin.com/feed](https://www.linkedin.com/feed) — active filters apply automatically

## Usage

Click the extension icon in the Chrome toolbar to open the popup, where you can:

- Toggle filters on or off — changes apply instantly without a page reload
- See how many posts of each type have been blocked
- Reset the counters

## How it works

LinkedIn uses stable semantic markers in its feed HTML regardless of its obfuscated CSS classes. The extension detects post types by looking for specific text labels (`"Promoted"`, `"Suggested"`, `"Recommended for you"`) and activity phrases (`"likes this"`, `"commented on this"`, etc.) inside each `[role="listitem"]` element.

A `MutationObserver` watches the feed so posts injected on scroll are caught immediately. Hidden posts leave no gap in the layout and can be restored at any time by toggling the filter off.
