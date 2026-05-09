async function saveHighlights(text, color) {

  const url = window.location.href;
  const result = await chrome.storage.local.get(url);
  const highlights = result[url] || [];

  highlights.push({ text, color });
  await chrome.storage.local.set({ [url]: highlights });
  console.log('Saved Highlight: ', text, color);
}

async function loadHighlights() {
  const url = window.location.href;
  const result = await chrome.storage.local.get(url);
  const highlights = result[url] || [];

  if (!highlights || highlights.length === 0) return;
  highlights.forEach(function (highlight) {
    restoreHighlight(highlight.text, highlight.color);
  });
}

function restoreHighlight(text, color) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  let node;

  while (node = walker.nextNode()) { //Checks if there is next node available and assings the node, returns null which is falsy if no next node
    const index = node.textContent.indexOf(text); // Checks the index of our saved highlight in raw text
    if (index !== -1) {

      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + text.length);

      const mark = document.createElement('mark');
      mark.style.backgroundColor = color;         // Warping the contents of selected range in <mark>
      mark.style.borderRadius = '3px';
      mark.classList.add('webmark-highlight');

      try {
        range.surroundContents(mark);
      }
      catch (e) {
        console.log("Couldnt Restore !!!");
      }

      break;
    }
  }
}



