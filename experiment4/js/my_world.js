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
  return 32;
}
function p3_tileHeight() {
  return 16;
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

  let terrainType = random();  // 0 ~ 1

  // 画菱形底
  beginShape();
  if (terrainType < 0.5) {
    fill(0, 105, 148); // 深海蓝
  } else if (terrainType < 0.7) {
    fill(0, 180, 216); // 浅蓝水域
  } else if (terrainType < 0.85) {
    fill(173, 216, 230); // 浅滩水色
  } else if (terrainType < 0.95) {
    fill(255, 182, 193); // 珊瑚色（粉色偏红）
  } else {
    fill(238, 214, 175); // 沙滩色（浅黄色）
  }
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // 点击后的效果（比如种一个小海草）
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(34, 139, 34, 200); // 深绿色的海草
    ellipse(0, 0, 10, 14);
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