function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex = currentIndex - 1;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

let gameBoardSize = 4; // 4 | 5 | 6
const root = document.documentElement;
const boardUl = document.querySelector("ul");
const board4Button = document.querySelector("#board4");
const board5Button = document.querySelector("#board5");
const board6Button = document.querySelector("#board6");

/**
 * UNFINISHED -> !TODO: Implement effects,
 * more details here: [https://www.craft.do/s/N91APmB5tlehg8]
 *  */
// const happeningName = document.querySelector("#activated-effect");
// happeningName.addEventListener("click", function () {
//   const happenings = Object.keys(Happening.trigger);
//   const randomHappening = happenings[Math.floor(Math.random() * happenings.length)];
//   Happening.trigger[randomHappening]();
// });

const selectBoardSize = (size) => {
  isGameStarted = false;
  startButton.textContent = "START";
  document.querySelector("#game-state").textContent = "STOP";
  startButton.style.setProperty("disabled", "false");
  clearInterval(gameTimerInterval);
  currentlyFlipped = [];
  timer.textContent = "00:00";
  shuffle(numberCards);

  const SELECTION_MAP = {
    4: [5, 6],
    5: [4, 6],
    6: [4, 5],
  };
  boardUl.style.setProperty("--game-board-size", size);
  gameBoardSize = size;
  document.getElementById(`board${size}`).classList.add("selected");
  document.getElementById(`board${SELECTION_MAP[size][0]}`).classList.remove("selected");
  document.getElementById(`board${SELECTION_MAP[size][1]}`).classList.remove("selected");
  initGame();
};

board4Button.addEventListener("click", function () {
  selectBoardSize(4);
});
board5Button.addEventListener("click", function () {
  selectBoardSize(5);
});
board6Button.addEventListener("click", function () {
  selectBoardSize(6);
});

let numberCards = [];
let currentlyFlipped = [];
let match = 0;
let moves = 0;
let timer = document.querySelector("#timer");
let deck = document.querySelector(".deck");
let scorePanel = document.querySelector("#score-panel");
let moveNum = document.querySelector(".moves.data");
let restart = document.querySelector(".restart");
let delay = 500;
let secondsCounter = 0;
let gameTimerInterval = null;
let startButton = document.querySelector("#start-button");
let isGameStarted = false;

if (deck.children.length === 0) {
  deck.style.setProperty("--game-board-size", gameBoardSize);
  initGame();
}

startButton.addEventListener("click", function (e) {
  startTimer();
  isGameStarted = true;
  startButton.style.setProperty("disabled", "true");
  createEmojiParticles(e.target);
  document.querySelector("#game-state").textContent = "START";
});

/**
 * Timer function and rendering elapsed time and converting it to regular digital clock format
 */
function startTimer() {
  clearInterval(gameTimerInterval);
  secondsCounter = 0;
  gameTimerInterval = setInterval(() => {
    secondsCounter++;
    timer.textContent = secondsCounter;
    let minutes = Math.floor(secondsCounter / 60);
    let seconds = secondsCounter % 60;
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    timer.textContent = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds}`;
    if (minutes > 59) {
      let hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      timer.textContent = `${hours < 10 ? `0${hours}` : hours}:${minutes}:${seconds}`;
    }
  }, 1000);
}

/**
 * This is called on every instance a game board is generated -> a game started, most of our variables are reset here
 */
function initGame() {
  // Fill cards array with numbers from 1 to boardSize squared to formulate a grid of cards
  numberCards = [];
  match = 0;
  moves = 0;
  for (let i = 1; i <= gameBoardSize ** 2 / 2; i++) {
    numberCards.push(i.toString(), i.toString());
  }

  // Shuffle cards array
  const cards = shuffle(numberCards);
  deck.innerHTML = "";
  match = 0; // Reset Match
  moves = 0; // Reset Moves
  moveNum.textContent = moves;
  cards.forEach((i) => {
    const card = document.createElement("li");
    card.className = "card button";
    card.innerHTML = `<span>${i}</span>`;
    deck.appendChild(card);
  });
}

/**
 * This is called when the game is won => we stop the timer and show a popup with the stats and values are reset
 * @param {*} moves The amount of moves we needed to win the game
 */
function endGame(moves) {
  let text = `Congratulations! You Won! (Moves: ${moves} | Time: ${timer.textContent})`;
  alert(text);
  clearInterval(gameTimerInterval);
  isGameStarted = false;
  startButton.textContent = "START";
  startButton.style.setProperty("disabled", "false");
  moves = 0;
  moveNum.textContent = moves;
  currentlyFlipped = [];
  timer.textContent = "00:00";
}

/**
 * Click listener for the small reset icon button on the right side of the score panel
 */
restart.addEventListener("click", () => {
  initGame();
  startTimer();
  isGameStarted = true;
  startButton.textContent = "START";
  document.querySelector("#game-state").textContent = "STOP";
  startButton.style.setProperty("disabled", "true");
  moves = 0;
  moveNum.textContent = moves;
  currentlyFlipped = [];
  timer.textContent = "00:00";
  clearInterval(gameTimerInterval);
  isGameStarted = false;
  shuffle(numberCards);
  animateReset();
});

/**
 * Here is most of the game logic, we check if the card is already flipped, if it's a match or not and if the game is won
 * @param {*} target The card we clicked on
 * @returns
 * Instead of a matrix, we kinda handle the game board data in the DOM / CSS classes themselves, although a more structured approach would use a matrix in my opinion
 * We also use a delay variable to make sure the animations are finished before we remove the classes
 * For time concerns, I did not want to refactor this part / restructure the code
 *
 */
deck.addEventListener("click", function ({ target }) {
  if (!isGameStarted) return;
  checkForWin();
  if (
    !target.classList.contains("card") ||
    target.classList.contains("match") ||
    target.classList.contains("open")
  ) {
    return;
  }

  if (document.querySelectorAll(".show").length > 1) {
    return true;
  }

  target.classList.add("open", "show");
  currentlyFlipped.push(target.innerHTML);

  if (currentlyFlipped.length > 1) {
    moves++;

    if (target.innerHTML === currentlyFlipped[0]) {
      const openCards = document.querySelectorAll(".open");
      openCards.forEach(function (openCard) {
        openCard.classList.add("match", "animated", "infinite", "rubberBand");
        setTimeout(function () {
          openCard.classList.remove("open", "show", "animated", "infinite", "rubberBand", "button");
        }, delay);
      });
      match++;
      currentlyFlipped = [];
    } else {
      const openCards = document.querySelectorAll(".open");
      openCards.forEach(function (openCard) {
        openCard.classList.add("notmatch", "animated", "infinite", "wobble");
        setTimeout(function () {
          openCard.classList.remove("animated", "infinite", "wobble");
        }, delay / 1.1);
        setTimeout(function () {
          openCard.classList.remove("open", "show", "notmatch", "animated", "infinite", "wobble");
        }, delay);
      });

      moveNum.textContent = moves;
      currentlyFlipped = [];
    }
  }

  // End Game if match all cards
  if (gameBoardSize ** 2 / 2 === match) {
    setTimeout(function () {
      endGame(moves);
    }, 500);
  }
});

function checkForWin() {
  const didWin = document.querySelectorAll(".match").length === gameBoardSize ** 2;
  if (didWin) {
    clearInterval(gameTimerInterval);
    setTimeout(() => {
      endGame(moves);
    }, 500);
  }
}
