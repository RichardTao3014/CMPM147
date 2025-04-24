// sketch.js - purpose and description here
// Author: Richard Tao
// Date:04/21/2025

/* exported setup, draw */
/* global createCanvas, noise, rect, fill, floor, random, width, height, noLoop, createButton, colorMode, HSB, textSize, text, key, keyCode */

let tileSize = 16;
let cols, rows;
let worldGrid, dungeonGrid;
let isDrawDungeon = false;

let tileMap = {
  'W': [4, 0],  // water
  'F': [2, 1],  // forest
  'S': [1, 3],  // snow
  'H': [0, 3],  // house
  'T': [3, 3],  // treasure
  '#': [0, 7],  // wall
  '+': [2, 6],  // floor
  'O': [1, 4]   // totem
};

function setup() {
  cols = 20;
  rows = 20;
  // createCanvas(cols * tileSize, rows * tileSize);
  createCanvas(cols * tileSize, rows * tileSize).parent("canvasContainer");
  noLoop();
  colorMode(HSB);
  textSize(12);

  worldGrid = generateWorldMap(cols, rows);
  dungeonGrid = generateDungeonMap(cols, rows);

  let toggleBtn = createButton("Toggle Map");
    toggleBtn.parent("buttonRow");  // ✅ 放在外层 div，而不是另一个按钮里面
    toggleBtn.mousePressed(() => {
    isDrawDungeon = !isDrawDungeon;
    redraw();
  });
  
  document.getElementById("reseedButton").addEventListener("click", () => {
    if (isDrawDungeon) {
      dungeonGrid = generateDungeonMap(cols, rows);
    } else {
      worldGrid = generateWorldMap(cols, rows);
    }
    redraw();
  });

}

function updateAsciiBox(grid) {
  let output = "";
  for (let j = 0; j < grid.length; j++) {
    output += grid[j].join("") + "";
  }
  document.getElementById("asciiBox").value = output;
}


function draw() {
  let grid = isDrawDungeon ? dungeonGrid : worldGrid;
  drawGrid(grid);
  updateAsciiBox(grid);  // ✅ 把字符填到 textarea
}

function generateWorldMap(cols, rows) {
  noiseSeed(floor(random(10000)));  // 🔥 reseed perlin noise
  let grid = [];
  let noiseScale = 0.1;
  for (let j = 0; j < rows; j++) {
    let row = [];
    for (let i = 0; i < cols; i++) {
      let n = noise(i * noiseScale, j * noiseScale);
      if (n < 0.3) row.push('W');
      else if (n < 0.5) row.push('F');
      else if (n < 0.7) row.push('S');
      else if (n < 0.9) row.push(' ');
      else row.push('H');
    }
    grid.push(row);
  }

  // 随机放置宝藏
  for (let k = 0; k < 10; k++) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    grid[y][x] = 'T';
  }

  return grid;
}

function generateDungeonMap(cols, rows) {
  let grid = Array.from({ length: rows }, () => Array(cols).fill('#'));

  function carveRoom(x, y, w, h) {
    for (let j = y; j < y + h; j++) {
      for (let i = x; i < x + w; i++) {
        if (i > 0 && j > 0 && i < cols - 1 && j < rows - 1)
          grid[j][i] = '+';
      }
    }
  }

  let rooms = [];
  for (let n = 0; n < 5; n++) {
    let w = floor(random(4, 8));
    let h = floor(random(4, 6));
    let x = floor(random(1, cols - w - 1));
    let y = floor(random(1, rows - h - 1));
    rooms.push({ x, y, w, h });
    carveRoom(x, y, w, h);
  }

  for (let i = 1; i < rooms.length; i++) {
    let ax = rooms[i - 1].x + floor(rooms[i - 1].w / 2);
    let ay = rooms[i - 1].y + floor(rooms[i - 1].h / 2);
    let bx = rooms[i].x + floor(rooms[i].w / 2);
    let by = rooms[i].y + floor(rooms[i].h / 2);
    if (random() < 0.5) {
      carveRoom(min(ax, bx), ay, abs(ax - bx) + 1, 1);
      carveRoom(bx, min(ay, by), 1, abs(ay - by) + 1);
    } else {
      carveRoom(ax, min(ay, by), 1, abs(ay - by) + 1);
      carveRoom(min(ax, bx), by, abs(ax - bx) + 1, 1);
    }
  }

  for (let k = 0; k < 6; k++) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    if (grid[y][x] === '+') grid[y][x] = 'O';
  }

  for (let k = 0; k < 6; k++) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    if (grid[y][x] === '+') grid[y][x] = 'T';
  }

  return grid;
}

function drawGrid(grid) {
  clear();
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[0].length; i++) {
      let ch = grid[j][i];
      if (ch === ' ') continue;
      let tile = tileMap[ch];
      if (tile) placeTile(i, j, tile[0], tile[1]);
    }
  }
}
