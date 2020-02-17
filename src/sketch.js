let cirTexture, sqTexture, trTexture;
let catchSound;
let shipImage, bgImage;

let windowWidth = 1200, windowHeight = 900;

let shipX, shipY;
let ship;

window.onload = function() {
  function preload() {
    cirTexture = loadImage('../assets/gold.png');
    sqTexture = loadImage('../assets/metal.png');
    trTexture = loadImage('../assets/glass.png');
    bgImage = loadImage('../assets/background.jpg');
    shipImage = loadImage('../assets/spaceship.png');
    shipX = windowWidth*0.4;
    shipY = windowHeight*0.7;
  }

  function setup() {
    createCanvas(windowWidth*0.9, windowHeight*0.9);
    background(bgImage);
    ship = new Ship(shipImage,shipX, shipY);
  }

  function draw() {
    clear();
    background(bgImage);
    ship.draw();
  }

  function getRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

};
