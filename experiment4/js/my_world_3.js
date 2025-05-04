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

let eruptionTimes = {}; // 记录爆发开始的时间


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
    clicks[key] = (clicks[key] | 0) + 1;
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
    let terrainNoise = noise(nx, ny);
  
    // 海拔高度
    let elevation = terrainNoise; // 0 ~ 1
  
    // 根据海拔高度设置地面颜色
    if (elevation < 0.4) {
      fill(30, 30, 30); // 低地，深灰色
    } else if (elevation < 0.6) {
      fill(100, 0, 0); // 中地，暗红
    } else if (elevation < 0.8) {
      fill(200, 50, 0); // 高地，橘红
    } else {
      fill(255, 80, 0); // 山顶区域，明亮熔岩色
    }
  
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
  
    // 检查点击
    let clickCount = clicks[[i, j]] | 0;
    if (clickCount % 2 == 1) {
      // 点击后生成火山
      let pulse = 3 + sin((frameCount + i * 10 + j * 10) * 0.2) * 2;
  
      // 火山口位置偏移：根据 elevation 调高
      let volcanoHeight = map(elevation, 0, 1, 0, -8);
  
      fill(255, 100, 0, 200);
      ellipse(0, volcanoHeight, pulse + 8, pulse + 4);
  
      fill(200, 200, 200, 150); // 烟雾
      ellipse(0, volcanoHeight - 10, pulse * 2, pulse);
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