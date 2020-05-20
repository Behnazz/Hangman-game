const wordEl = document.getElementById('word');
const wrongLetterEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-again');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const figureParts = document.querySelectorAll(".figure-part");

let words = [];
let selectedWord;
const correctLetters = [];
const wrongLetters = [];

//fetch random word
const getRandomWord = async () => {
  const res = await fetch('https://random-word-api.herokuapp.com/all');
  const data = await res.json();
  words = data;
  selectedWord = words[Math.floor(Math.random() * data.length)];
  displayWord();
}
getRandomWord();

//show the hidden word
const displayWord = () => {
  wordEl.innerHTML = `${selectedWord
    .split('')
    .map(letter => `
    <span class="letter">
    ${correctLetters.includes(letter) ? letter : ''}
    </span>`)
    .join('')
    }`;
  
  //stop showing each letter on a new line
  const innerWord = wordEl.innerText.replace(/\n/g, '');

  //check if you won or not to display the popup
  if (innerWord === selectedWord) {
    finalMessage.innerText = 'Congratulations! You Won :)';
    popup.style.display = 'flex';
  }
}

//show notification to tell user they repeated the letter
const showNotification = () => {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show')
  }, 2000)
}

//updates the wrong letters
const updateWrongLettersEl = () => {
  //display the wrong letters
  wrongLetterEl.innerHTML = `
  ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
  ${wrongLetters.map(letter => `<span>${letter}</span>`)}
`;
  
  //display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });
  //check lost 
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = 'Unfortunately you lost :|';
    popup.style.display = 'flex';
  };
}

//keyDown letter place
window.addEventListener('keydown',e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

//restart the game and play again

playAgainBtn.addEventListener('click', async () => {
  //empty correct and wrong arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  displayWord();
  updateWrongLettersEl();
  
  popup.style.display = 'none'
});

getRandomWord();
