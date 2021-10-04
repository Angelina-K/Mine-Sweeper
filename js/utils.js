"use strict";

function createMat(size) {
  var mat = [];
  for (var i = 0; i < size; i++) {
    var row = [];
    for (var j = 0; j < size; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      row.push(cell);
      //   row.push("");
    }
    mat.push(row);
  }
  return mat;
}

function renderBoard(board) {
  var strHTML = "<table>";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      var className = `cell cell${i}-${j}`;
      strHTML += `<td class="${className}"  onclick="cellClicked(${i},${j},this)" oncontextmenu="markCell(${i},${j})" ></td>`;
    }
    strHTML += "</tr>";
  }
  strHTML += "</table>";
  var elcontainer = document.querySelector(".board-container");
  elcontainer.innerHTML = strHTML;
}

function renderCell(i, j, value) {
  var elCell = document.querySelector(`.cell${i}-${j}`);
  elCell.innerHTML = value;
}

function getClassName(i, j) {
  var cellClass = "cell-" + i + "-" + j;
  return cellClass;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function countNeighbors(cellI, cellJ, mat) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= mat[i].length) continue;
      if (mat[i][j].isMine) neighborsCount++;
    }
  }
  return neighborsCount;
}

function getNegsLocs(i, j) {
  console.log(".");
}
