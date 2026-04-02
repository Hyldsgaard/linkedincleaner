const DEFAULTS = {
  filters: { promoted: true },
  counts:  { promoted: 0 }
};

function render({ filters, counts }) {
  document.getElementById('toggle-promoted').checked = filters.promoted;
  document.getElementById('count-promoted').textContent = `${counts.promoted} blocked`;
}

chrome.storage.local.get(DEFAULTS, (data) => render(data));

document.getElementById('toggle-promoted').addEventListener('change', (e) => {
  chrome.storage.local.get(DEFAULTS, ({ filters, counts }) => {
    filters.promoted = e.target.checked;
    chrome.storage.local.set({ filters });
  });
});

document.getElementById('reset').addEventListener('click', () => {
  const counts = { promoted: 0 };
  chrome.storage.local.set({ counts });
  document.getElementById('count-promoted').textContent = '0 blocked';
});
