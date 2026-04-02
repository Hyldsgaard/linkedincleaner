(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    [data-linkedin-promoted]    { display: none !important; }
    [data-linkedin-suggested]   { display: none !important; }
    [data-linkedin-recommended] { display: none !important; }
    [data-linkedin-activity]    { display: none !important; }
  `;
  document.head.appendChild(style);

  const DEFAULTS = {
    filters: { promoted: true, suggested: true, recommended: true, activity: false },
    counts:  { promoted: 0, suggested: 0, recommended: 0, activity: 0 }
  };
  let currentFilters = DEFAULTS.filters;

  // Single-label filters: exact text match → attribute + count key
  const FILTER_MAP = {
    'Promoted':            { attr: 'data-linkedin-promoted',    key: 'promoted' },
    'Suggested':           { attr: 'data-linkedin-suggested',   key: 'suggested' },
    'Recommended for you': { attr: 'data-linkedin-recommended', key: 'recommended' },
  };

  // Activity filter: post headers like "X liked/commented/reposted this"
  const ACTIVITY_PHRASES = [
    'likes this',
    'commented on this',
    'reposted this',
    'celebrates this',
    'loves this',
    'supports this',
    'finds this funny',
    'finds this insightful',
  ];

  function getFeedChild(post) {
    // Walk up to the direct child of the feed container to eliminate gaps
    const feed = document.querySelector('[data-testid="mainFeed"]');
    let el = post;
    while (el && el.parentElement !== feed) {
      el = el.parentElement;
    }
    return el || post;
  }

  function markPost(post, attr, key) {
    if (!post.hasAttribute(attr)) {
      post.setAttribute(attr, 'true');
      getFeedChild(post).setAttribute(attr, 'true');
      chrome.storage.local.get(DEFAULTS, ({ counts }) => {
        counts[key]++;
        chrome.storage.local.set({ counts });
      });
    }
  }

  function applyFilters() {
    const listitems = document.querySelectorAll(
      '[data-testid="mainFeed"] [role="listitem"]'
    );

    for (const post of listitems) {
      const walker = document.createTreeWalker(post, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const label = node.textContent.trim();

        // Single-label filters
        const filter = FILTER_MAP[label];
        if (filter) {
          if (currentFilters[filter.key]) {
            markPost(post, filter.attr, filter.key);
          } else {
            post.removeAttribute(filter.attr);
            getFeedChild(post).removeAttribute(filter.attr);
          }
          break;
        }

        // Activity filter
        if (ACTIVITY_PHRASES.some(phrase => label.endsWith(phrase))) {
          if (currentFilters.activity) {
            markPost(post, 'data-linkedin-activity', 'activity');
          } else {
            post.removeAttribute('data-linkedin-activity');
            getFeedChild(post).removeAttribute('data-linkedin-activity');
          }
          break;
        }
      }
    }
  }

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.filters) {
      currentFilters = changes.filters.newValue;
      applyFilters();
    }
  });

  chrome.storage.local.get(DEFAULTS, ({ filters }) => {
    currentFilters = filters;
    applyFilters();

    const observer = new MutationObserver(applyFilters);
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
