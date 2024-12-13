const canvas = document.getElementById('canvas');
const textOverlay = document.getElementById('text-overlay');
const history = [];
let historyIndex = -1;
let selectedTextElement = null;

const swiper = new Swiper('.swiper', {
  loop: true, 
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

function addText() {
  const newText = document.createElement('div');
  newText.classList.add('text-element');
  newText.contentEditable = true; 
  newText.innerText = 'Your Text Here';
  newText.style.position = 'absolute';
  newText.style.left = '50px'; 
  newText.style.top = '50px';
  newText.style.fontSize = '16px';
  newText.style.fontFamily = 'Arial';

  textOverlay.appendChild(newText);
  makeDraggable(newText);
  selectTextElement(newText); 
  saveState();
}


let currentText = null;

function dragStart(e) {
  currentText = e.target;

  const offsetX = e.offsetX;
  const offsetY = e.offsetY;

  function dragMove(event) {
    if (currentText) {
      currentText.style.left = `${event.pageX - offsetX}px`;
      currentText.style.top = `${event.pageY - offsetY}px`;
    }
  }

  function dragEnd() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    currentText = null;
    saveState();
  }

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function makeDraggable(element) {
  element.addEventListener('mousedown', dragStart);
}

function selectTextElement(element) {
  if (selectedTextElement) {
    selectedTextElement.classList.remove('selected');
  }
  selectedTextElement = element;
  selectedTextElement.classList.add('selected');
}

function changeFont() {
  if (selectedTextElement) {
    const font = document.getElementById('fontSelector').value;
    selectedTextElement.style.fontFamily = font;
    saveState();
  } else {
    alert('Please select a text element.');
  }
}

function changeFontSize() {
  if (selectedTextElement) {
    const fontSize = document.getElementById('fontSize').value + 'px';
    selectedTextElement.style.fontSize = fontSize;
    saveState();
  } else {
    alert('Please select a text element.');
  }
}

function toggleBold() {
  if (selectedTextElement) {
    selectedTextElement.style.fontWeight =
      selectedTextElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
    saveState();
  } else {
    alert('Please select a text element.');
  }
}

function toggleItalic() {
  if (selectedTextElement) {
    selectedTextElement.style.fontStyle =
      selectedTextElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
    saveState();
  } else {
    alert('Please select a text element.');
  }
}

function toggleUnderline() {
  if (selectedTextElement) {
    selectedTextElement.style.textDecoration =
      selectedTextElement.style.textDecoration === 'underline'
        ? 'none'
        : 'underline';
    saveState();
  } else {
    alert('Please select a text element.');
  }
}

function saveState() {
  const currentState = textOverlay.innerHTML;
  history.splice(historyIndex + 1, history.length - historyIndex - 1, currentState);
  historyIndex++;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    textOverlay.innerHTML = history[historyIndex];
    restoreDraggable();
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    textOverlay.innerHTML = history[historyIndex];
    restoreDraggable();
  }
}

function restoreDraggable() {
  document.querySelectorAll('.text-element').forEach((element) => {
    makeDraggable(element);
    element.addEventListener('click', () => selectTextElement(element));
  });
}
