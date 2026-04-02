const DEFAULTS = {
  filters: { promoted: true, suggested: true, recommended: true, activity: false },
  counts:  { promoted: 0, suggested: 0, recommended: 0, activity: 0 }
};

const FILTERS = ['promoted', 'suggested', 'recommended', 'activity'];

function render({ filters, counts }) {
  for (const key of FILTERS) {
    document.getElementById(`toggle-${key}`).checked = filters[key];
    document.getElementById(`count-${key}`).textContent = `${counts[key]} blocked`;
  }
}

chrome.storage.local.get(DEFAULTS, (data) => render(data));

for (const key of FILTERS) {
  document.getElementById(`toggle-${key}`).addEventListener('change', (e) => {
    chrome.storage.local.get(DEFAULTS, ({ filters, counts }) => {
      filters[key] = e.target.checked;
      chrome.storage.local.set({ filters });
    });
  });
}

document.getElementById('reset').addEventListener('click', () => {
  const counts = { promoted: 0, suggested: 0, recommended: 0, activity: 0 };
  chrome.storage.local.set({ counts });
  for (const key of FILTERS) {
    document.getElementById(`count-${key}`).textContent = '0 blocked';
  }
});
