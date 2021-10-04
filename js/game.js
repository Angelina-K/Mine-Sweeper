"use strict";

var gBoard;
var gminesLocations = [];
var gActiveMines = 0;
// var gTime = 0;
var gTimerInterval;

var gLevel = {
  size: 4,
  mines: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  lives: 3,
  secPassed: 0,
};

const MINE = "🧨";
const FLAG = "🚩";
// const NUM = 0;
const LIFE = "♥";

function init() {
  gBoard = createMat(gLevel.size);
  renderBoard(gBoard);
  console.log(gBoard);
}

function startGame(firstCellClicked) {
  gGame.isOn = true;
  gTimerInterval = setInterval(startTimer, 1);
  console.log(gBoard);
  addMines(firstCellClicked, gLevel.mines);
  addNums();
  renderBoardContent(gBoard);
}

function renderBoardContent(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      var cellContent = getCellsContent(i, j);
      var elCell = document.querySelector(`.cell${i}-${j}`);
      elCell.setAttribute("content", cellContent);
    }
  }
}

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

// FIXME MINE on firstclick
function addMines(firstCellClicked, mines) {
  var minesLocs = [];
  var numOfMinesSet = 0;

  while (numOfMinesSet < mines) {
    var location = {
      i: getRandomInt(0, gBoard.length - 1),
      j: getRandomInt(0, gBoard[0].length - 1),
    };
    if (location !== firstCellClicked) {
      numOfMinesSet++;
      minesLocs.push(location);
      gBoard[location.i][location.j].isMine = true;
    }
  }
  gActiveMines = numOfMinesSet;
  return minesLocs;
}

function startTimer() {
  gGame.secPassed += 1;
  var sec = (gGame.secPassed / 1000).toFixed(3);
  var elTimer = document.querySelector(".timer ");
  elTimer.innerText = sec;
}

function cellClicked(i, j, cell) {
  console.log("gGame.shownCount", gGame.shownCount);
  console.log("gActiveMines", gActiveMines);
  var cellLocation = { i: i, j: j };
  var cell = gBoard[i][j];
  if (!gGame.isOn && !gGame.shownCount) {
    startGame(cellLocation);
  }
  if (gGame.isOn && !cell.isMarked) {
    if (!cell.isMine && !cell.minesAroundCount) {
      revealNegsContent(i, j, gBoard);
    }
    // gGame.shownCount++;
    // gBoard[i][j].isShown = true;
    console.log(gBoard[i][j]);
    if (cell.isMine) mineExploded();
  }
  revealCellContent(i, j);
}

function markCell(i, j) {
  var cell = gBoard[i][j];
  if (!cell.isMarked) {
    if (!cell.isShown) {
      cell.isMarked = true;
      gGame.markedCount++;
      renderCell(i, j, FLAG);
      if (cell.isMine) gActiveMines--;
    }
  } else {
    renderCell(i, j, "");
    cell.isMarked = !cell.isMarked;
    gGame.markedCount--;
  }
  console.log("marked count", gGame.markedCount);
  console.log("active mines", gActiveMines);
}

function mineExploded() {
  gGame.lives--;
  gActiveMines--;
  console.log("active mines", gActiveMines);

  if (!gGame.lives) gameOver("lose");
}

function gameOver(gameOutcome) {
  console.log(`you ${gameOutcome}`);
  clearInterval(gTimerInterval);
  gGame.isOn = false;
}

function revealCellContent(i, j) {
  var elCell = document.querySelector(`.cell${i}-${j}`);
  elCell.classList.add("reveal");
  var cellContent = elCell.getAttribute("content");
  renderCell(i, j, cellContent);
  gBoard[i][j].isShown = true;
  gGame.shownCount++;
  checkIfWin();
}
// FIXME over counting showen cells?
function checkIfWin() {
  console.log("gGame.shownCount", gGame.shownCount);
  console.log("gActiveMines", gActiveMines);
  if (
    gGame.shownCount - gGame.markedCount >= Math.pow(gLevel.size) &&
    !gActiveMines
  )
    gameOver(win);
}

function revealNegsContent(cellI, cellJ, mat) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine) continue;
      if (mat[i][j].isMarked) continue;
      revealCellContent(i, j);
    }
  }
}

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
