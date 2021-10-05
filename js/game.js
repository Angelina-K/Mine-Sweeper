"use strict";

var gBoard;
var gminesLocations = [];
var gActiveMines = 0;
var gTimerInterval;
var gCurrHintBtn;

const MINE = "💣";
const FLAG = "🚩";
const LIFE = "🤍";

var gLevel = {
  size: 8,
  mines: 12,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  lives: gLevel.size === 4 ? [LIFE] : [LIFE, LIFE, LIFE],
  secPassed: 0,
  safeClicks: 3,
  isHintMode: false,
};
// ************************************************
function init() {
  gBoard = createMat(gLevel.size);
  renderBoard(gBoard);
}
// ************************************************
function setLevel(size, mines) {
  gLevel.size = size;
  gLevel.mines = mines;
  resetGame();
  gBoard = createMat(size);
  renderBoard(gBoard);
}
// ************************************************
function resetGame() {
  var elTitle = document.querySelector("h1");
  elTitle.innerText = "MineSweeper;";
  elTitle.style.fontSize = 70 + "px";
  var elSmily = document.querySelector(".smily");
  elSmily.innerHTML = '<img src="img/normal.png" alt="" />';
  clearInterval(gTimerInterval);
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    lives: gLevel.size === 4 ? [LIFE] : [LIFE, LIFE, LIFE],
    secPassed: 0,
    safeClicks: 3,
    isHintMode: false,
  };
  gActiveMines = 0;
  var elTimer = document.querySelector(".timer ");
  elTimer.innerText = gGame.secPassed;
  gBoard = createMat(gLevel.size);
  renderBoard(gBoard);
  renderLives();
  renderSafeClicks();
}
// ************************************************
function startGame(firstCellClicked) {
  gGame.isOn = true;
  gTimerInterval = setInterval(startTimer, 1);
  addMines(firstCellClicked, gLevel.mines);
  addNums();
  renderBoardContent(gBoard);
  renderLives();
  renderSafeClicks();
}
// ************************************************
function renderLives() {
  var elLife = document.querySelector(".lives");
  elLife.innerText = gGame.lives;
}
function renderSafeClicks() {
  var elSafeBtn = document.querySelector(".safe-cell span");
  elSafeBtn.innerText = gGame.safeClicks;
}
// ************************************************
function renderBoardContent(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      var cellContent = getCellsContent(i, j);
      var elCell = document.querySelector(`.cell${i}-${j}`);
      elCell.setAttribute("content", cellContent);
    }
  }
}
// ************************************************
function getCellsContent(i, j) {
  var cellContent;
  if (gBoard[i][j].isMine) {
    cellContent = MINE;
  } else if (gBoard[i][j].minesAroundCount) {
    cellContent = gBoard[i][j].minesAroundCount;
  } else {
    cellContent = "";
  }
  return cellContent;
}
// ************************************************
function addMines(firstCellClicked, mines) {
  var minesLocs = [];
  var numOfMinesSet = 0;

  while (numOfMinesSet < mines) {
    var location = {
      i: getRandomInt(0, gBoard.length - 1),
      j: getRandomInt(0, gBoard[0].length - 1),
    };
    if (
      location.i !== firstCellClicked.i &&
      location.j !== firstCellClicked.j
    ) {
      gBoard[location.i][location.j].isMine = true;
      numOfMinesSet++;
      minesLocs.push(location);
    } else {
      continue;
    }
  }
  gActiveMines = numOfMinesSet;
  return minesLocs;
}
// ************************************************
function startTimer() {
  gGame.secPassed += 1;
  var sec = (gGame.secPassed / 1000).toFixed(3);
  var elTimer = document.querySelector(".timer ");
  elTimer.innerText = sec;
}
// ************************************************
function cellClicked(i, j, cell) {
  if (gGame.isHintMode) {
    getHint(i, j);
    return;
  }
  var cellLocation = { i: i, j: j };
  var cell = gBoard[i][j];
  if (cell.isShown) return;
  if (!gGame.isOn && !gGame.shownCount) {
    startGame(cellLocation);
  }
  if (gGame.isOn && !cell.isMarked && !cell.isShown) {
    if (!cell.isMine && !cell.minesAroundCount) {
      revealNegsContent(i, j, gBoard);
      return;
    } else if (cell.isMine) {
      mineExploded(i, j);
      return;
    } else {
      revealCellContent(i, j);
    }
  }
}
// ************************************************
function markCell(i, j, ev) {
  ev.preventDefault();
  var cell = gBoard[i][j];
  if (!cell.isMarked) {
    if (!cell.isShown) {
      cell.isMarked = true;
      gGame.markedCount++;
      renderCell(i, j, FLAG);
      if (cell.isMine) {
        gActiveMines--;
      }
    }
  } else {
    renderCell(i, j, "");
    cell.isMarked = !cell.isMarked;
    gGame.markedCount--;
  }
}
// ************************************************
function mineExploded(i, j) {
  gGame.lives.pop();
  renderLives();
  gActiveMines--;
  revealCellContent(i, j);
  if (!gGame.lives.length) {
    gameOver("lose");
    var elMine = document.querySelector(`.cell${i}-${j}`);
    elMine.style.background = "#de6f58";
  }
}
// ************************************************
function gameOver(gameOutcome) {
  var elTitle = document.querySelector("h1");
  elTitle.innerText = `Game Over
  you ${gameOutcome}`;
  elTitle.style.fontSize = 35 + "px";
  var elSmily = document.querySelector(".smily");
  elSmily.innerHTML =
    gameOutcome === "lose"
      ? '<img src="img/lose.png" alt="" />'
      : '<img src="img/win.png" alt="" />';

  clearInterval(gTimerInterval);
  gGame.isOn = false;

  var elMines = document.querySelectorAll(`td[content=${MINE}]`);
  for (let i = 0; i < elMines.length; i++) {
    elMines[i].classList.add("reveal");
    elMines[i].innerHTML = MINE;
  }
}
// ************************************************
function revealCellContent(i, j) {
  if (!gBoard[i][j].isShown) {
    var elCell = document.querySelector(`.cell${i}-${j}`);
    elCell.classList.add("reveal");
    var cellContent = elCell.getAttribute("content");

    renderCell(i, j, cellContent);
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
  }
  checkIfWin();
}
// ************************************************
function checkIfWin() {
  if (
    gGame.shownCount === Math.pow(gLevel.size, 2) - gGame.markedCount &&
    !gActiveMines
  )
    gameOver("win");
}
// ************************************************
function revealNegsContent(cellI, cellJ, mat) {
  var negsForHint = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue;
      if (gGame.isHintMode) {
        negsForHint.push({ i: i, j: j });
        revealCellContent(i, j);
      }
      if (mat[i][j].isMine) continue;
      if (mat[i][j].isMarked) continue;
      revealCellContent(i, j);
    }
  }
  return negsForHint;
}
// ************************************************
// var count = 0;
// function revealNegsContent(cellI, cellJ, mat) {
//   var negsFound = [];
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= mat.length) continue;
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (i === cellI && j === cellJ) continue;
//       if (j < 0 || j >= mat[i].length) continue;
//       if (mat[i][j].isMine) continue;
//       if (mat[i][j].isMarked) continue;
//       revealCellContent(i, j);
//       if (!mat[i][j].minesAroundCount) {
//         if (mat[i][j] !== mat[cellI][cellJ]) {
//           revealNegsContent(i,j,mat)

//           negsFound.shift();
//           negsFound.push({ i: i, j: j });
//         }
//       }
//     }
//   }

//   // if (negsFound.length) {
//   //   console.log("negsFound.length", negsFound.length);
//   //   for (let i = 0; i < negsFound.length; i++) {
//   //     var currNegLoc = negsFound[i];
//   //     revealNegsContent(currNegLoc.i, currNegLoc.j, mat);
//   //     negsFound.shift();
//   //   }
//   // }
// }
// ************************************************
function addNums() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      var negMinesCount = countNeighbors(i, j, gBoard);
      if (!gBoard[i][j].isMine) {
        gBoard[i][j].minesAroundCount = negMinesCount;
      }
    }
  }
}
// ************************************************
function getHint(i, j) {
  var negs = revealNegsContent(i, j, gBoard);
  gGame.isHintMode = false;

  setTimeout(function () {
    for (let i = 0; i < negs.length; i++) {
      var currNeg = negs[i];
      gBoard[currNeg.i][currNeg.j].isShown = false;
      renderCell(currNeg.i, currNeg.j, "");
      var elCell = document.querySelector(`.cell${currNeg.i}-${currNeg.j}`);
      elCell.classList.remove("reveal");
      gCurrHintBtn.removeAttribute("onclick");
      gCurrHintBtn.style.visibility = "hidden";
    }
  }, 3000);
}
// ************************************************
function storeBtn(hintBtn) {
  gGame.isHintMode = true;
  gCurrHintBtn = hintBtn;
  gCurrHintBtn.style.opacity = 1;
}
// ************************************************
function safeClick() {
  if (!gGame.safeClicks) return;
  var safeCell;
  while (!safeCell) {
    var i = getRandomInt(0, gBoard.length - 1);
    var j = getRandomInt(0, gBoard[0].length - 1);
    if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
      safeCell = gBoard[i][j];
      var elSafeCell = document.querySelector(`.cell${i}-${j}`);
      elSafeCell.classList.add("flash");

      setTimeout(function () {
        elSafeCell.classList.remove("flash");
      }, 1500);
      gGame.safeClicks--;
      renderSafeClicks();
    }
  }
}
