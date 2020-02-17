let cirTexture, sqTexture, trTexture;
let catchSound;
let shipImage, bgImage;

var showDebugMessages = true;
var firingRate = 25; //  <--- tells you how often you an shoot a lazer
var lazers = [];

let windowWidth = innerWidth,
  windowHeight = innerHeight;

let shipX, shipY;
let ship, asterisk;
var particles = [];
let testImage;

function preload() {
  cirTexture = loadImage("../assets/1.png");
  sqTexture = loadImage("../assets/tr1.png");
  bgImage = loadImage("../assets/background.jpg");
  shipImage = loadImage("../assets/spaceship.png");
  shipX = windowWidth * 0.4;
  shipY = windowHeight * 0.7;
}

function setup() {
  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("myCanvas");
  background(bgImage);
  ship = new Ship(shipImage, shipX, shipY);

  varImage = trTexture;
  pX = getRnd(0, 1100);
  pY = getRnd(0, 200);
  particlesCount = 5;
  score = 0;
  for (i = 0; i < particlesCount; i++) {
    let prtcl = generateParticle();
    particles.push(prtcl);
  }
}

function draw() {
  background(bgImage);
  for (let i = lazers.length - 1; i >= 0; i--) {
    lazers[i].draw();
    if (!lazers[i].update()) {
      lazers.splice(i, 1);
      if (showDebugMessages) {
        console.log("Lazer #" + i + " left the screen!");
      }
    } else {
      for (let j = particles.length - 1; j >= 0; j--) {
        let distance = Math.sqrt(
          Math.pow(lazers[i].x - particles[j].getPositionX(), 2) +
            Math.pow(lazers[i].y - particles[j].getPositionY(), 2)
        );
        if (distance < 25 * 1.3) {
          lazers.splice(i, 1);
          particles[j].remove();
          particles.splice(j, 1);
          if (showDebugMessages) {
            console.log("Hit particle #" + j + " with lazer #" + i);
          }
          break;
        }
      }
    }
  }
  ship.draw();
  for (i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    //print(particles[i].getPosition());

    if (particles[i] != null) {
      if (particles[i].getPositionY() > 800) {
        particles[i].remove();
        particles.splice(i, 1);
      }
    }

    if (particles.length <= 2 && particles.length >= 0) {
      type = int(random(0, 2));
      // print(type);
      particles.push(generateParticle());
    }
  }
}

function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateParticle() {
  let x = getRnd(0, 1200);
  let y = random(0, 50);
  return new Particle(x, y);
}
