console.log("Web Mark content script loaded.");

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

  const mark = document.createElement('mark');
  mark.style.backgroundColor = color;         // Warping the contents of selected range in <mark>
  mark.style.borderRadius = '3px';
  mark.classList.add('webmark-highlight');


  try{
    range.surroundContents(mark);
  }
  catch(e){
    console.log("Complex Selection!!!")
  }

  selection.removeAllRanges();
  tooltip.style.display = 'none';
});


