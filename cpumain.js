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
let userImage;
let cpuImage;
const cellElements = document.querySelectorAll("[data-cell]");
const xCountElement = document.querySelector(".res1");
const oCountElement = document.querySelector(".res3");
const tieCountElement = document.querySelector(".res2");
const restart = document.querySelector(".icon-restart");

startGame();

restart.addEventListener("click", restartGame);

function restartGame() {
  cellElements.forEach((cell) => {
    cell.innerHTML = "";
  });
  userImage = "";
  cpuImage = "";
}

function startGame() {
  xTurn = true;
  userImage = "x";
  cpuImage = "o";
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
    cell.innerHTML = "";
    cell.classList.remove("winning-x", "winning-o");
  });

  setBoardHover();
}

function handleClick(e) {
  const cell = e.target;
  const currentPlayer = xTurn ? userImage : cpuImage;
  placeGameMark(cell, currentPlayer);

  if (checkWin(currentPlayer)) {
    endGame(currentPlayer);
  } else if (isBoardFull()) {
    endGame();
  } else {
    switchTurn();
    if (!xTurn) {
      setTimeout(makeCPUMove, 20);
    }
  }
}

function placeGameMark(cell, currentPlayer) {
  cell.innerHTML = `<img src="./assets/icon-${currentPlayer}.svg" style="height: 30px; width: 30px;">`;
}

function switchTurn() {
  xTurn = !xTurn;
  if (xTurn) {
    userImage = "x";
    cpuImage = "o";
  } else {
    userImage = "o";
    cpuImage = "x";
  }
}

// Rest of the code remains unchanged
// ...

/*const x_Turn = "x";
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
const xCountElement = document.querySelector(".res1");
const oCountElement = document.querySelector(".res3");
const tieCountElement = document.querySelector(".res2");
const restart = document.querySelector(".icon-restart")

startGame();

restart.addEventListener("click", restartGame);

function restartGame() {
  cellElements.forEach((cell) => {
    cell.innerHTML = "";
  });
}

function startGame() {
  xTurn = true;
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
    cell.innerHTML = "";
    cell.classList.remove("winning-x", "winning-o");
  });

  setBoardHover();
}


function handleClick(e) {
  const cell = e.target;
  const currentPlayer = xTurn ? x_Turn : o_Turn;
  placeGameMark(cell, currentPlayer);

  if (checkWin(currentPlayer)) {
    endGame(currentPlayer);
  } else if (isBoardFull()) {
    endGame();
  } else {
    switchTurn();
    if (!xTurn) {
      setTimeout(makeCPUMove, 20);
    }
  }
}


function placeGameMark(cell, currentPlayer) {
  cell.innerHTML = `<img src="./assets/icon-${currentPlayer}.svg" style="height: 30px; width: 30px;">`;
}

function switchTurn() {
  xTurn = !xTurn;
}  */

function handleMouseOver(e) {
  const cell = e.target;
  if (!cell.querySelector("img")) {
    const hoverPlayer = xTurn ? x_Turn : o_Turn;
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
      cell.classList.add(currentPlayer === "o" ? "winning-o" : "winning-x");
      img.classList.add("highlight");
    });
  }
}


function makeCPUMove() {
  const availableCells = [...cellElements].filter((cell) => !cell.querySelector("img"));
  if (availableCells.length > 0) {
    const currentPlayer = o_Turn;
    let bestScore = -Infinity;
    let bestMove;

    availableCells.forEach((cell) => {
      const index = Array.from(cellElements).indexOf(cell);
      cell.innerHTML = `<img src="./assets/icon-${currentPlayer}.svg" style="height: 30px; width: 30px;">`;
      const score = minimax(cellElements, 0, false);
      cell.innerHTML = "";
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    });

    placeGameMark(bestMove, currentPlayer);

    if (checkWin(currentPlayer)) {
      endGame(currentPlayer);
    } else if (isBoardFull()) {
      endGame();
    } else {
      switchTurn();
    }
  }
}

function makeCPUMove() {
  const availableCells = [...cellElements].filter((cell) => !cell.querySelector("img"));
  if (availableCells.length > 0) {
    const currentPlayer = o_Turn;
    let bestScore = -Infinity;
    let bestMove;

    // Set initial depth limit
    const depthLimit = 3;

    availableCells.forEach((cell) => {
      const index = Array.from(cellElements).indexOf(cell);
      cell.innerHTML = `<img src="./assets/icon-${currentPlayer}.svg" style="height: 30px; width: 30px;">`;

      // Use minimax with depth limit
      const score = minimax(cellElements, 0, false, depthLimit);

      cell.innerHTML = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    });

    placeGameMark(bestMove, currentPlayer);

    if (checkWin(currentPlayer)) {
      endGame(currentPlayer);
    } else if (isBoardFull()) {
      endGame();
    } else {
      switchTurn();
    }
  }
}

function minimax(board, depth, isMaximizing, depthLimit) {
  const currentPlayer = isMaximizing ? o_Turn : x_Turn;

  if (checkWin(x_Turn)) {
    return -10;
  } else if (checkWin(o_Turn)) {
    return 10;
  } else if (isBoardFull() || depth === depthLimit) {
    return 0;
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  board.forEach((cell, index) => {
    if (!cell.querySelector("img")) {
      cell.innerHTML = `<img src="./assets/icon-${currentPlayer}.svg" style="height: 30px; width: 30px;">`;

      if (isMaximizing) {
        const score = minimax(board, depth + 1, false, depthLimit);
        bestScore = Math.max(score, bestScore);
      } else {
        const score = minimax(board, depth + 1, true, depthLimit);
        bestScore = Math.min(score, bestScore);
      }

      cell.innerHTML = "";
    }
  });

  return bestScore;
}




function endGame(winner) {
  if (winner) {
    if (winner === x_Turn) {
      xCount++;
      xCountElement.textContent = xCount;
      highlightWinningCombination(x_Turn);
      document.getElementById("winmessage2").style.display = "flex"; 
    } else {
      oCount++;
      oCountElement.textContent = oCount;
      highlightWinningCombination(o_Turn);
      document.getElementById("winmessage1").style.display = "flex"; 
    }
  } else {
    tieCount++;
    tieCountElement.textContent = tieCount;
    document.getElementById("winmessage3").style.display = "flex"; 
  }

  cellElements.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });
}


const nextRoundButtons = document.querySelectorAll("#next");
nextRoundButtons.forEach((button) => {
  button.addEventListener("click", nextRound);
});

const nextRoundButton3 = document.querySelectorAll("#next3");
nextRoundButton3.forEach((button) => {
  button.addEventListener("click", nextRound);
});


function nextRound() {
  cellElements.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winning-x", "winning-o");
  });

  xTurn = true;

  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
  });

  if (!xTurn) {
    makeCPUMove();
  }

  // Hide win messages
  document.getElementById("winmessage1").style.display = "none";
  document.getElementById("winmessage2").style.display = "none";
  document.getElementById("winmessage3").style.display = "none";
}

