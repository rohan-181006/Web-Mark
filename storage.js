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

async function saveNote(id,data){
  const url = window.location.href;
  const storageKey = url + '_note';
  
  const result = await chrome.storage.local.get(storageKey);
  const notes = result[storageKey] || {};

  notes[id] = data;
  await chrome.storage.local.set({ [storageKey]: notes});
}

async function deleteNote(id){
  const url = window.location.href;
  const storageKey = url + '_note';

  const result = await chrome.storage.local.get(storageKey);
  const notes = result[storageKey] || {};
  
  delete notes[id];

  await chrome.storage.local.set({ [storageKey]: notes});
}

async function loadNotes(){
  const url = window.location.href;
  const storageKey = url + '_note';

  const result = await chrome.storage.local.get(storageKey);
  const notes = result[storageKey];

  if(!notes) return;

  Object.entries(notes).forEach(function([id,data]){
    createStickyNote(data.x, data.y, id, data.text, data.color);
  });
}

async function removeHighlights(text) {
  const url = window.location.href;
  const result = await chrome.storage.local.get(url);
  let highlights = result[url] || [];
  
  highlights = highlights.filter(function (h) {
    return h.text !== text;
  });
  await chrome.storage.local.set({ [url]: highlights });
}
