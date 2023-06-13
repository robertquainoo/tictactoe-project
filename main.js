const x_Turn = "x";
const o_Turn = "o";
let xCount = 0;
let oCount = 0;
let tieCount = 0;
const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let xTurn;
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.querySelector(".board");
const xCountElement = document.querySelector(".res1");
const oCountElement = document.querySelector(".res3");
const tieCountElement = document.querySelector(".res2");
const restart = document.querySelector(".icon-restart");

startGame();
setBoardHover();

restart.addEventListener("click", restartGame);

function restartGame() {
  cellElements.forEach((cell) => {
    cell.innerHTML = "";
  });
}


function startGame() {
  xTurn = false;
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
    cell.innerHTML = "";
    cell.classList.remove("winning-x", "winning-o");
  });
  if (!checkWin(x_Turn) && !checkWin(o_Turn)) {
    setBoardHover();
  } else {
    cellElements.forEach((cell) => {
      cell.removeEventListener("mouseover", handleMouseOver);
      cell.removeEventListener("mouseout", handleMouseOut);
    });
  }
}

function handleClick(e) {
  const cell = e.target;
  const currentPlayer = xTurn ? o_Turn : x_Turn;
  placeGameMark(cell, currentPlayer);
  console.log("Current Player:", currentPlayer);
  console.log("Cell Text Content:", cell.textContent);
  console.log("Win Condition Check:", checkWin(currentPlayer));
  switchTurn();
  if (checkWin(currentPlayer)) {
      if (currentPlayer === x_Turn ) {
        xCount++;
        xCountElement.textContent = xCount;
        highlightWinningCombination(currentPlayer)
        document.getElementById("winmessage2").style.display = "flex"; 
      } else {
        oCount++;
        oCountElement.textContent = oCount;
        highlightWinningCombination(currentPlayer)
        document.getElementById("winmessage1").style.display = "flex"; 
      }
      console.log("Winner");
      cellElements.forEach((cell) => {
      cell.removeEventListener("click", handleClick);
      cell.removeEventListener("mouseover", handleMouseOver);
      cell.removeEventListener("mouseout", handleMouseOut);
      });
    } else if (isBoardFull()) {
      tieCount++;
      tieCountElement.textContent = tieCount;
      document.getElementById("winmessage3").style.display = "flex"; 
  }
  setBoardHover();
}

function placeGameMark(cell, currentPlayer) {
  cell.innerHTML = `<img src="./assets/icon-${currentPlayer}.svg" style="height: 30px; width: 30px;">`;
}

function switchTurn() {
  xTurn = !xTurn;
  const xImage = document.querySelector(".x");
  const oImage = document.querySelector(".o");

  if (!xTurn) {
    xImage.style.display = "inline-block";
    oImage.style.display = "none";
  } else {
    xImage.style.display = "none";
    oImage.style.display = "inline-block";
  }
}

function handleMouseOver(e) {
  const cell = e.target;
  if (!cell.querySelector("img")) {
    const hoverPlayer = xTurn ? o_Turn : x_Turn;
    const hoverImage = document.createElement("img");
    hoverImage.src = `./assets/icon-${hoverPlayer}-outline.svg`;
    hoverImage.style.height = "30px";
    hoverImage.style.width = "30px";
    cell.appendChild(hoverImage);
  }
}

function handleMouseOut(e) {
  const cell = e.target;
  const hoverImage = cell.querySelector("img");
  if (hoverImage) {
    const hoverImageSrc = hoverImage.getAttribute("src");
    if (
      hoverImageSrc === "./assets/icon-x-outline.svg" ||
      hoverImageSrc === "./assets/icon-o-outline.svg"
    ) {
      cell.removeChild(hoverImage);
    }
  }
}

function setBoardHover() {
  cellElements.forEach((cell) => {
    cell.addEventListener("mouseover", handleMouseOver);
    cell.addEventListener("mouseout", handleMouseOut);
  });
}

function checkWin(currentPlayer) {
  return winningCombination.some((combination) => {
    return combination.every((index) => {
      const cell = cellElements[index];
      const img = cell.querySelector("img");
      return img && img.getAttribute("src") === `./assets/icon-${currentPlayer}.svg`;
    });
  });
}

function isBoardFull() {
  return [...cellElements].every((cell) => {
    const img = cell.querySelector("img");
    return img !== null;
  });
}

function highlightWinningCombination(currentPlayer) {
  const winningCells = winningCombination.find((combination) => {
    return combination.every((index) => {
      const cell = cellElements[index];
      const img = cell.querySelector("img");
      return img && img.getAttribute("src") === `./assets/icon-${currentPlayer}.svg`;
    });
  });

  if (winningCells) {
    winningCells.forEach((index) => {
      const cell = cellElements[index];
      const img = cell.querySelector("img");
      cell.classList.add(currentPlayer === 'o' ? 'winning-o' : 'winning-x');
      img.classList.add('highlight');
    });
  }
}

const nextRoundButtons = document.querySelectorAll("#next");
nextRoundButtons.forEach((button) => {
  button.addEventListener("click", nextRound);
});

const next3RoundButtons = document.querySelectorAll("#next3");
next3RoundButtons.forEach((button) => {
  button.addEventListener("click", nextRound);
});

function nextRound() {
  cellElements.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winning-x", "winning-o");
  });

  xTurn = false;
  setBoardHover();

  const winMessages = document.querySelectorAll(".win-message");
  winMessages.forEach((message) => {
    message.style.display = "none";
  });

  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });
}

