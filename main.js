    //Home page Functionalities//
const highlightX = document.getElementById('homediv1');
const highlightO = document.getElementById('homediv2');
const imgX = document.querySelector('.homeimgsize_1');
const imgO = document.querySelector('.homeimgsize_2');
let anyImageClicked = false;
function showHighlightX() {
  highlightX.style.display = 'block';
  highlightO.style.display = 'none';
}
function showHighlightO() {
  highlightO.style.display = 'block';
  highlightX.style.display = 'none';
}
function hideHighlightX() {
  highlightX.style.display = 'none';
}
function hideHighlightO() {
  highlightO.style.display = 'none';
}

imgX.addEventListener('mouseover', showHighlightX);
imgX.addEventListener('mouseout', function() {
  if (!imgX.clicked) {
    hideHighlightX();
  }
});
imgX.addEventListener('click', function() {
  imgX.clicked = true;
  imgX.style.filter =" hue-rotate(0deg) saturate(0) brightness(0.45) contrast(1.2) ";
  imgO.clicked = false;
  anyImageClicked = true
});

imgO.addEventListener('mouseover', showHighlightO);
imgO.addEventListener('mouseout', function() {
  if (!imgO.clicked) {
    hideHighlightO();
  }
});
imgO.addEventListener('click', function() {
  imgO.clicked = true;
  imgO.style.filter =" hue-rotate(0deg) saturate(0) brightness(0.45) contrast(1.2) ";
  imgX.clicked = false;
  anyImageClicked = true
});
 

// Selectors for continuation of the home functionatilies//
const newGamePlayers = document.querySelector('.newgameplayers');
const newGameCPU = document.querySelector('.newgameCPU');
const turnOffHome = document.querySelector(".turnoffhomepage");
newGameCPU.addEventListener("click", function() {
  if (anyImageClicked) {
    clickNewCPU();
  }
});
newGamePlayers.addEventListener('click', function() {
  if (anyImageClicked) {
    clickNewPlayers();
  }
});

function clickNewCPU() {
  newGamePage('X (YOU)', "O (CPU)");
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
const xCountElement = document.querySelector(".res1");
const oCountElement = document.querySelector(".res3");
const tieCountElement = document.querySelector(".res2");
const restart = document.querySelector(".icon-restart")

cpustartGame();

restart.addEventListener("click", restartGame);

function restartGame() {
  document.getElementById("restartmessage").style.display = "flex"; 
}

function cpustartGame() {
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
}  

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
    let bestScore = -100000;
    let bestMove;
    const depthLimit = 6;

    availableCells.forEach((cell) => {
      const index = Array.from(cellElements).indexOf(cell);
      cell.innerHTML = `<img src="./assets/icon-${currentPlayer}.svg" style="height: 30px; width: 30px;">`;
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

  let bestScore = isMaximizing ? -100000 : Infinity;

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

const continueGame = document.querySelectorAll("#continue_game");
continueGame.forEach((element) => {
  element.addEventListener("click", negateRestart);
});

function negateRestart(){
  document.getElementById("restartmessage").style.display = "none";
}

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

}

function clickNewPlayers() {
  newGamePage('X (P2)', "O (P1)");
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
const xCountElement = document.querySelector(".res1");
const oCountElement = document.querySelector(".res3");
const tieCountElement = document.querySelector(".res2");
const restart = document.querySelector(".icon-restart");

startGame();
setBoardHover();

restart.addEventListener("click", restartGame);

function restartGame() {
  document.getElementById("restartmessage").style.display = "flex"; 
}

function startGame() {
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

const continueGame = document.querySelectorAll("#continue_game");
continueGame.forEach((element) => {
  element.addEventListener("click", negateRestart);
});

function negateRestart(){
  document.getElementById("restartmessage").style.display = "none";
}

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

}

                            /******Game Layout **** Board **** 9 Cells  *****  */    

function newGamePage(xPositionText, oPositionText){
turnOffHome.style.display = "none";
const container = document.createElement('div');
container.classList.add('container');

const imgPosition = document.createElement('img');
imgPosition.src = './assets/logo.svg';
imgPosition.classList.add('imgposition');

container.appendChild(imgPosition);
const gwidth = document.createElement('div');
gwidth.classList.add('gwidth');
container.appendChild(gwidth);

const xImg = document.createElement('img');
xImg.src = './assets/icon-x.svg';
xImg.classList.add('x');
gwidth.appendChild(xImg);

const oImg = document.createElement('img');
oImg.src = './assets/icon-o.svg';
oImg.classList.add('o');
gwidth.appendChild(oImg);

const turnPosition = document.createElement('p');
turnPosition.id = 'turnposition';
turnPosition.textContent = 'Turn';
gwidth.appendChild(turnPosition);

const restartDiv = document.createElement('div');
restartDiv.classList.add('icon-restart');
container.appendChild(restartDiv);

const restartImg = document.createElement('img');
restartImg.src = './assets/icon-restart.svg';
restartImg.classList.add('imgsize_3');

restartDiv.appendChild(restartImg);
const board = document.createElement('div');
board.classList.add('board');
container.appendChild(board);

for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('data-cell', '');
  board.appendChild(cell);
}

const results = document.createElement('div');
results.classList.add('results');
container.appendChild(results);
const cellResult1 = document.createElement('div');
cellResult1.classList.add('cellresult1');
results.appendChild(cellResult1);

const xPosition = document.createElement('p');
xPosition.classList.add('position');
xPosition.textContent = xPositionText;

cellResult1.appendChild(xPosition);
const res1 = document.createElement('p');
res1.classList.add('res1');
res1.textContent = '0';

cellResult1.appendChild(res1);
const cellResult2 = document.createElement('div');
cellResult2.classList.add('cellresult2');
results.appendChild(cellResult2);

const tiesPosition = document.createElement('p');
tiesPosition.classList.add('position');
tiesPosition.textContent = 'Ties';
cellResult2.appendChild(tiesPosition);

const res2 = document.createElement('p');
res2.classList.add('res2');
res2.textContent = '0';
cellResult2.appendChild(res2);

const cellResult3 = document.createElement('div');
cellResult3.classList.add('cellresult3');
results.appendChild(cellResult3);

const oPosition = document.createElement('p');
oPosition.classList.add('position');
oPosition.textContent = oPositionText;
cellResult3.appendChild(oPosition);

const res3 = document.createElement('p');
res3.classList.add('res3');
res3.textContent = '0';
cellResult3.appendChild(res3);
document.body.appendChild(container);

}

function createWinMessage(options) {
  const { id, wordText, imgSrc, colorText, hasQuit, hasNext } = options;

  const winMessage = document.createElement('div');
  winMessage.classList.add('win-message');
  winMessage.id = id;
  winMessage.style.zIndex = "100";

  const word = document.createElement('p');
  word.classList.add('word');
  word.style.fontWeight = "bold";
  word.textContent = wordText;
  winMessage.appendChild(word);

  const img = document.createElement('img');
  const color = document.createElement('p');
  color.style.fontWeight = "bold";
  img.src = imgSrc;
  if (imgSrc === './assets/icon-o.svg') {
    img.classList.add('owins');
    color.id = 'color1';
  } else if (imgSrc === './assets/icon-x.svg') {
    img.classList.add('xwins');
    color.id = 'color2';
  }
  if (imgSrc === './assets/icon-o.svg') {
    img.classList.add('owins');
    color.id = 'color1';
  } else if (imgSrc === './assets/icon-x.svg') {
    img.classList.add('xwins');
    color.id = 'color2';
  }
  if (imgSrc === '') {
    color.id = 'color3';
  } 
  winMessage.appendChild(img);
  color.textContent = colorText;
  winMessage.appendChild(color);

  if (hasQuit) {
    const quitLink = document.createElement('a');
    quitLink.href = './index.html';
    const quitDiv = document.createElement('div');
    quitDiv.id = 'quit';
    quitDiv.textContent = 'QUIT';
    quitLink.appendChild(quitDiv);
    winMessage.appendChild(quitLink);
  }

  if (hasNext) {
    const nextLink = document.createElement('a');
    const nextDiv = document.createElement('div');
    nextDiv.id = 'next';
    nextDiv.textContent = 'NEXT ROUND';
    nextLink.appendChild(nextDiv);
    winMessage.appendChild(nextLink);
  }

  document.body.appendChild(winMessage);
}

function createRestartMessage() {
  const restartMessage = document.createElement('div');
  restartMessage.id = 'restartmessage';

  const word = document.createElement('p');
  word.classList.add('word3');
  word.textContent = 'RESTART GAME?';
  restartMessage.appendChild(word);
    
  const continueDiv = document.createElement('div');
  continueDiv.id = 'continue_game';
  continueDiv.textContent = 'NO, CANCEL';
  restartMessage.appendChild(continueDiv);

  const cancelLink = document.createElement('a');
  cancelLink.href = './index.html';
  const cancelDiv = document.createElement('div');
  cancelDiv.id = 'cancel_game';
  cancelDiv.textContent = 'YES, CANCEL';
  cancelLink.appendChild(cancelDiv);
  restartMessage.appendChild(cancelLink);

  document.body.appendChild(restartMessage);
}

createWinMessage({
  id: 'winmessage1',
  wordText: 'PLAYER 1 WINS!',
  imgSrc: './assets/icon-o.svg',
  colorText: 'TAKES THE ROUND',
  hasQuit: true,
  hasNext: true
});

createWinMessage({
  id: 'winmessage2',
  wordText: 'PLAYER 2 WINS!',
  imgSrc: './assets/icon-x.svg',
  colorText: 'TAKES THE ROUND',
  hasQuit: true,
  hasNext: true
});

createWinMessage({
  id: 'winmessage3',
  wordText: '',
  imgSrc: '',
  colorText: 'ROUND TIED',
  hasQuit: true,
  hasNext: true
});

createRestartMessage();


