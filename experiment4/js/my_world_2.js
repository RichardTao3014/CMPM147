"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 50;
}
function p3_tileHeight() {
  return 25;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
  push();

  let seed = XXH.h32("tile:" + [i, j], worldSeed);
  randomSeed(seed);
  noiseSeed(seed);

  let nx = i * 0.1;
  let ny = j * 0.1;
  let n = noise(nx, ny);

  // 默认位置偏移量
  let yOffset = 0;

  let clickCount = clicks[[i, j]] | 0;
  if (clickCount % 2 == 1) {
    // 点击后，加入悬浮动画（上下摆动）
    yOffset = sin((frameCount + i * 10 + j * 10) * 0.05) * 20; // 摆动幅度±3像素
  }

  translate(0, yOffset); // 在绘制之前整体上下移动

  // 画 tile 菱形
  beginShape();
  if (n < 0.45) {
    fill(10, 10, 40); // 深蓝天空
  } else {
    let h = map(n, 0.45, 1, 50, 255);
    fill(80, 180, 120, h);
  }
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // 点击特效：种灯塔或者漂浮云
  if (clickCount % 2 == 1) {
    if (n > 0.45) {
      fill(255, 255, 100, 200);
      ellipse(0, -5, 6, 10); // 灯塔
    } else {
      fill(255, 255, 255, 120);
      ellipse(0, 0, 12, 8); // 小光云
    }
  }

  pop();
}


  


function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(255);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}