var rows = document.getElementById("rows");
var cols = document.getElementById("cols");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var rowS, colS;

canvas.addEventListener("mousedown", handleClick);
document.addEventListener("keydown", handleSpacebar);

var placed = 0;
var arrayRef, solRef;
var startX, startY, endX, endY;
var lastX = null, lastY = null;

function solve() {
  if (findPath(startX, startY)) {
    animatePath();
  } else alert("No Path Found");
}

function findPath(x, y) {
  if (x === endX && y === endY) {
    solRef[x][y] = 1;
    return true;
  }
  if (safeToGo(x, y)) {
    solRef[x][y] = 1;
    if (
      findPath(x + 1, y) || findPath(x, y + 1) || 
      findPath(x - 1, y) || findPath(x, y - 1)
    ) return true;
    solRef[x][y] = 0;
  }
  return false;
}

function safeToGo(x, y) {
  return x >= 0 && y >= 0 && x < rows.value && y < cols.value &&
         arrayRef[x][y] !== 1 && solRef[x][y] !== 1;
}

function animatePath() {
  let pathCells = [];

  for (let i = 0; i < rows.value; i++) {
    for (let j = 0; j < cols.value; j++) {
      if (solRef[i][j] === 1 && arrayRef[i][j] !== 2 && arrayRef[i][j] !== 3) {
        pathCells.push({ x: j, y: i });
      }
    }
  }

  pathCells.forEach((cell, index) => {
    setTimeout(() => {
      ctx.fillStyle = "blue";
      ctx.fillRect(cell.x * colS, cell.y * rowS, colS, rowS);
    }, index * 100);
  });
}

function handleClick(e) {
  var gridX = Math.floor(e.offsetY / rowS);
  var gridY = Math.floor(e.offsetX / colS);

  if (e.button === 0) {
    if (arrayRef[gridX][gridY] === 1) {
      // Remove obstacle if it exists
      ctx.clearRect(gridY * colS, gridX * rowS, colS, rowS);
      ctx.strokeRect(gridY * colS, gridX * rowS, colS, rowS);
      arrayRef[gridX][gridY] = 0;
    } else {
      // Add an obstacle
      ctx.fillStyle = "black";
      ctx.fillRect(gridY * colS, gridX * rowS, colS, rowS);
      arrayRef[gridX][gridY] = 1;
    }
  }

  lastX = gridX;
  lastY = gridY;
}

function handleSpacebar(e) {
  if (e.code === "Space" && lastX !== null && lastY !== null) {
    var x = lastY * colS, y = lastX * rowS;

    if (placed === 0) {
      ctx.fillStyle = "red";
      ctx.fillRect(x, y, colS, rowS);
      placed = 1;
      startX = lastX;
      startY = lastY;
      arrayRef[startX][startY] = 2;
    } else if (placed === 1) {
      ctx.fillStyle = "green";
      ctx.fillRect(x, y, colS, rowS);
      placed = 2;
      endX = lastX;
      endY = lastY;
      arrayRef[endX][endY] = 3;
    }
  }
}

function genGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  placed = 0;
  rowS = canvas.height / rows.value;
  colS = canvas.width / cols.value;

  arrayRef = Array.from({ length: rows.value }, () => Array(cols.value).fill(0));
  solRef = Array.from({ length: rows.value }, () => Array(cols.value).fill(0));

  ctx.beginPath();
  for (var i = 0; i <= rows.value; i++) {
    ctx.moveTo(0, i * rowS);
    ctx.lineTo(canvas.width, i * rowS);
  }
  for (var j = 0; j <= cols.value; j++) {
    ctx.moveTo(j * colS, 0);
    ctx.lineTo(j * colS, canvas.height);
  }
  ctx.stroke();
}