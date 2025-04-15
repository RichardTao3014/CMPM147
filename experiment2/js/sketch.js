// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

let seed = 0;
let colors = {};
let bushes = [];

function setup() {
  //createCanvas(800, 400);
  let canvas = createCanvas(800, 400);
  canvas.parent("canvas-container");
  noStroke();
  colors = {
    sky: color(173, 216, 230),
    ground: color(237, 201, 175),
    mountain: color(130, 110, 100),
    bush: color(100, 140, 100),
    cloud: color(255, 255, 255, 150)
  };
  generateScene();

  $("#reimagine").click(() => {
    seed++;
    generateScene();
    redraw();
  });
}

function draw() {
  background(colors.sky);

  drawMountains();
  drawGround();
  drawBushes();
  drawClouds();
}

function generateScene() {
  randomSeed(seed);
  bushes = [];
  for (let i = 0; i < 20; i++) {
    bushes.push({
      x: random(width),
      y: random(height / 2, height - 30),
      s: random(20, 40)
    });
  }
}

function drawGround() {
  fill(colors.ground);
  rect(0, height / 2, width, height / 2);
}

function drawMountains() {
  fill(colors.mountain);
  beginShape();
  vertex(0, height / 2);
  let xoff = 0;
  for (let x = 0; x <= width; x += 20) {
    let y = height / 2 - noise(xoff) * 100;
    vertex(x, y);
    xoff += 0.05;
  }
  vertex(width, height / 2);
  endShape(CLOSE);
}

function drawBushes() {
  fill(colors.bush);
  for (let b of bushes) {
    ellipse(b.x, b.y, b.s, b.s / 1.5);
  }
}

function drawClouds() {
  fill(colors.cloud);
  for (let i = 0; i < 3; i++) {
    let x = (millis() / 20 + i * 200) % width;
    let y = 50 + sin((millis() / 1000) + i) * 10;
    ellipse(x, y, 80, 40);
    ellipse(x + 30, y + 10, 60, 30);
    ellipse(x - 30, y + 10, 60, 30);
  }
}
