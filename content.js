console.log("Web Mark content script loaded.");

//--------------------Highlights--------------------

const tooltip = document.createElement("div");
tooltip.id = 'webmark-tooltip';

tooltip.innerHTML = `
  <button data-color="#FFEB3B">🟡</button>
  <button data-color="#A5D6A7">🟢</button>
  <button data-color="#90CAF9">🔵</button>
  <button data-color="#EF9A9A">🔴</button>
`;

tooltip.style.display = 'none';
document.body.appendChild(tooltip);

document.addEventListener('mouseup', function(event){
  const selectedText = window.getSelection().toString().trim();

  if(selectedText.length > 0){
    tooltip.style.left = event.pageX + 'px';
    tooltip.style.top = (event.pageY - 50) + 'px';
    tooltip.style.display = 'flex';
  }
  else{
    tooltip.style.display = 'none';
  }
});


document.addEventListener('mousedown', function(event){
  if(event.target.closest('#webmark-tooltip') === null){ // This walks UP the DOM and checks if the event.target has the parent tooltip 
    tooltip.style.display = 'none';                     //So getting null is the conditon where it is sure that user aint touching tooltip
  }
});

tooltip.addEventListener('click',function(event){
  if(event.target.closest('button') === null){
    return; 
  }

  const color = event.target.dataset.color; 

  const selection = window.getSelection();
  if(!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();

  const mark = document.createElement('mark');
  mark.style.backgroundColor = color;         // Warping the contents of selected range in <mark>
  mark.style.borderRadius = '3px';
  mark.classList.add('webmark-highlight');


  try{
    range.surroundContents(mark);
    saveHighlights(selectedText, color);
  }
  catch(e){
    console.log("Complex Selection!!!")
  }

  selection.removeAllRanges();
  tooltip.style.display = 'none';
});



//--------------------Sticky Notes--------------------

function generateId() {
  return 'note-' + Date.now();
}

function createStickyNote(x, y, id = generateId(), text = '', color = '#FFEB3B') {
  const note = document.createElement('div');
  note.id = id;
  note.className = 'webmark-note';

  note.style.left = x + 'px';
  note.style.top = y + 'px';

  note.innerHTML = `
    <div class="webmark-note-header">
      <div class="webmark-note-colors">
        <span data-note-color="#FFEB3B" style="background:#FFEB3B"></span>
        <span data-note-color="#A5D6A7" style="background:#A5D6A7"></span>
        <span data-note-color="#90CAF9" style="background:#90CAF9"></span>
        <span data-note-color="#EF9A9A" style="background:#EF9A9A"></span>
      </div>
      <button class="webmark-note-close">✕</button>
    </div>
    <textarea class="webmark-note-textarea" placeholder="Type your note...">${text}</textarea>
  `;

  note.style.backgroundColor = color;

  //Drag Logic

  const header = note.querySelector('.webmark-note-header');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener('mousedown', function (event) {
    isDragging = true;

    offsetX = event.pageX - note.offsetLeft;
    offsetY = event.pageY - note.offsetTop;

    event.preventDefault();

  });

  document.addEventListener('mousemove', function (event) {
    if (!isDragging) return;

    note.style.left = event.pageX - offsetX + 'px';
    note.style.top = event.pageY - offsetY + 'px';
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;

    saveNote(id, {
      x: note.offsetLeft,
      y: note.offsetTop,
      text: note.querySelector('.webmark-note-textarea').value,
      color: note.style.backgroundColor
    });
  });

  //Close Button

  const closeButton = note.querySelector('.webmark-note-close');
  closeButton.addEventListener('click', function () {
    note.remove();
    deleteNote(id);
  });

  //Save text on every key stroke
  note.querySelector('.webmark-note-textarea').addEventListener('input', function () {
    saveNote(id, {
      x: note.offsetLeft,
      y: note.offsetTop,
      text: this.value,
      color: note.style.backgroundColor
    });
  });

  //Color picker
  note.querySelectorAll('[data-note-color]').forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      const newColor = this.dataset.noteColor;
      note.style.backgroundColor = newColor;

      saveNote(id, {
        x: note.offsetLeft,
        y: note.offsetTop,
        text: note.querySelector('.webmark-note-textarea').value,
        color: newColor
      });
    });
  });

  document.body.appendChild(note);
  return note;
}

//Double Click to create note

document.addEventListener('dblclick', function (event) {
  if (event.target.closest('.webmark-note')) return;
  if (event.target.closest('#webmark-tooltip')) return;

  const id = generateId();
  createStickyNote(event.pageX, event.pageY, id);

  saveNote(id, {
    x: event.pageX,
    y: event.pageY,
    text: "",
    color: '#FFEB3B'
  });
});

loadHighlights();
loadNotes();
