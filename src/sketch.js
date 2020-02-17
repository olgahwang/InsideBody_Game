let cirTexture, sqTexture, trTexture;
let catchSound;
let shipImage, bgImage;

let windowWidth = 1200, windowHeight = 900;

let shipX, shipY;
let ship, asterisk;
var particles = [];
let testImage;

function preload() {
    cirTexture = loadImage('../assets/1.png');
    sqTexture = loadImage('../assets/tr1.png');
    bgImage = loadImage('../assets/background.jpg');
    shipImage = loadImage('../assets/spaceship.png');
    shipX = windowWidth*0.4;
    shipY = windowHeight*0.7;
  }

function setup() {
    createCanvas(windowWidth*0.9, windowHeight*0.9);
    background(bgImage);
    ship = new Ship(shipImage,shipX, shipY);

    varImage = trTexture;
    createCanvas(1200, 900);
    pX = getRnd(0, 1100);
    pY = getRnd(0, 200);
    particlesCount = 4;
    score = 0;
    for (i=0; i<particlesCount; i++){
      let prtcl = generateParticle();
      particles.push(prtcl);
    }

}

  function draw() {
    clear();
    background(bgImage);
    ship.draw();
    for (i = particles.length-1; i >= 0; i--){
      particles[i].update();
      particles[i].draw();
      //print(particles[i].getPosition());

      if (particles[i] != null){
        if (particles[i].getPosition() > 800){
          particles.splice(i,1);
        }
      }

      if (particles.length <= 2 && particles.length >= 0){
        type = int(random(0,2));
        print(type);
        particles.push(generateParticle());
    }
    }
  }

  function getRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  function generateParticle(){
  let x = getRnd(0, 1200);
  let y = random(0, 50);
  return new Particle(x, y);
}
