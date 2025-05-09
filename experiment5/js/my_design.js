/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
    return [
      {
        name: "Yellowstone National Park", 
        assetUrl: "img/Yellowstone National Park.jpg",
        credit: "Yellowstone National Park"
      },
      {
        name: "Yosemite National Park", 
        assetUrl: "img/Yosemite National Park.jpg",
        credit: "Yosemite National Park"
      },
      {
        name: "Death Valley National Park", 
        assetUrl: "img/Death Valley National Park.jpg",
        credit: "Death Valley National Park"
      },
      {
        name: "Joshua Tree National Park", 
        assetUrl: "img/Joshua Tree National Park.jpg",
        credit: "Joshua Tree National Park"
      },
    ];
  }

function initDesign(inspiration) {
    // 设置画布尺寸
    let canvasContainer = $('.image-container');
    let canvasWidth = canvasContainer.width();
    let aspectRatio = inspiration.image.height / inspiration.image.width;
    let canvasHeight = canvasWidth * aspectRatio;
    resizeCanvas(canvasWidth, canvasHeight);
    $(".caption").text(inspiration.credit);
  
    // 显示原图
    const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`;
    $('#original').empty();
    $('#original').append(imgHTML);
  
    // 获取图像中心像素作为背景色
    let centerX = inspiration.image.width / 2;
    let centerY = inspiration.image.height / 2;
    let bgColor = inspiration.image.get(centerX, centerY);
  
    let design = {
      bg: {
        r: red(bgColor),
        g: green(bgColor),
        b: blue(bgColor)
      },
      fg: []
    };
  
    // 为每个图块从图像中采样颜色
    for (let i = 0; i < 10000; i++) {
      let x = random(width);
      let y = random(height);
  
      let imgX = x * (inspiration.image.width / width);
      let imgY = y * (inspiration.image.height / height);
      let c = inspiration.image.get(imgX, imgY);
  
      design.fg.push({
        x: x,
        y: y,
        w: random(5, 20),
        h: random(5, 20),
        fill: {
          r: red(c),
          g: green(c),
          b: blue(c)
        }
      });
    }
  
    return design;
  }
  


  function renderDesign(design, inspiration) {
    
    background(design.bg.r, design.bg.g, design.bg.b);
    noStroke();
    for (let dot of design.fg) {
        fill(dot.fill.r, dot.fill.g, dot.fill.b, 128);
        ellipse(dot.x + dot.w / 2, dot.y + dot.h / 2, dot.w, dot.h);
      }
  }

function mutateDesign(design, inspiration, rate) {
    design.bg.r = mut(design.bg.r, 0, 255, rate);
    design.bg.g = mut(design.bg.g, 0, 255, rate);
    design.bg.b = mut(design.bg.b, 0, 255, rate);

    
    for (let box of design.fg) {
      // 位置和大小依旧可以突变
      box.x = mut(box.x, 0, width, rate);
      box.y = mut(box.y, 0, height, rate);
      box.w = mut(box.w, 5, 20, rate);
      box.h = mut(box.h, 5, 20, rate);
  
      // 颜色围绕原色轻微突变（防止跳色）
      box.fill.r = mut(box.fill.r, 0, 255, rate);
      box.fill.g = mut(box.fill.g, 0, 255, rate);
      box.fill.b = mut(box.fill.b, 0, 255, rate);
    }
  }
  
  function mut(num, min, max, rate) {
      return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
  }
  