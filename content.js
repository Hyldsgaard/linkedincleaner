(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = '[data-linkedin-promoted] { display: none !important; }';
  document.head.appendChild(style);

  const DEFAULTS = { filters: { promoted: true }, counts: { promoted: 0 } };
  let currentFilters = { promoted: true };

  function applyFilters() {
    // Hide newly found promoted posts if filter is on
    if (currentFilters.promoted) {
      const listitems = document.querySelectorAll(
        '[data-testid="mainFeed"] [role="listitem"]:not([data-linkedin-promoted])'
      );
      for (const post of listitems) {
        const walker = document.createTreeWalker(post, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent.trim() === 'Promoted') {
            post.setAttribute('data-linkedin-promoted', 'true');
            chrome.storage.local.get(DEFAULTS, ({ counts }) => {
              counts.promoted++;
              chrome.storage.local.set({ counts });
            });
            break;
          }
        }
      }
    } else {
      // Restore hidden promoted posts
      document.querySelectorAll('[data-linkedin-promoted]').forEach(el => {
        el.removeAttribute('data-linkedin-promoted');
      });
    }
  }

  // React to toggle changes from the popup
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.filters) {
      currentFilters = changes.filters.newValue;
      applyFilters();
    }
  });

  // Load initial filter state then start observing
  chrome.storage.local.get(DEFAULTS, ({ filters }) => {
    currentFilters = filters;
    applyFilters();

    const observer = new MutationObserver(applyFilters);
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
