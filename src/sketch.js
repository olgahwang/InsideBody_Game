let cirTexture, sqTexture, trTexture;
let catchSound;
let shipImage, bgImage;

let goods;
var showDebugMessages = false;
var firingRate = 25; //  <--- tells you how often you an shoot a lazer
var lazers = [];

let windowWidth = innerWidth,
  windowHeight = innerHeight;

let shipX, shipY;
let ship, asterisk;
var particles = [], nutriArray = [];
var nutrGroup;
let nutriCount = 5;
let testImage;
let playerScore;
let circeRounded;

let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
var portName = '/dev/tty.usbmodem14201';

let cur = 0;
let prev = 0;
let sensor_data = '';

function preload() {
  cirTexture = loadImage("../assets/1.png");
  sqTexture = loadImage("../assets/tr1.png");
  bgImage = loadImage("../assets/background.jpg");
  shipImage = loadImage("../assets/spaceship.png");
  shipX = windowWidth * 0.4;
  shipY = windowHeight * 0.7;
  playerScore = 0;
  circeRounded = loadFont('../fonts/CirceRounded.otf');
  nutrGroup = new Group();
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
    let newNutr = generateNutrSprite();
    nutrGroup.add(newNutr);
  }

  /*for (i = 0; i < nutriCount; i++) {
    let nutr = generateNutrient();
    nutriArray.push(nutr);
  }*/

  serial = new p5.SerialPort();

  //Show port information
  serial.list();
  serial.open(portName);
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);

}

function draw() {
  background(bgImage);
  checkBacteria();
  let ship_position = parseFloat(sensor_data);
  if(ship_position){
    ship.draw(ship_position);
  } else {
    ship.draw(0);
  }
  updateBacteria();
  //checkNutrient();
  updateNutrients();
  fill(0, 0, 0);
  textFont(circeRounded);
  textSize(20);
  text("Your Score: " + playerScore, 10, 40);
  drawSprites();
}



function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateParticle() {
  let x = getRnd(0, 1200);
  let y = random(0, 50);
  return new Particle(x, y);
}

function serverConnected() {
  print("Connected to Server");
}

//Bad guys There
function checkBacteria(){
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
          playerScore++;
          if (showDebugMessages) {
            console.log("Hit particle #" + j + " with lazer #" + i);
          }
          break;
        }
      }
    }
  }
}

function updateBacteria(){
  for (i = particles.length - 1; i >= 0; i--) {
    //particles[i].update();
    particles[i].draw();
    if (particles[i] != null) {
      if (particles[i].getPositionY() > 800) {
        particles[i].remove();
        particles.splice(i, 1);
      }
    }
  }

  if (particles.length <= 2 && particles.length >= 0) {
    type = int(random(0, 2));
    particles.push(generateParticle());
  }
}


// Nutrients here
function generateNutrSprite(){
  let x = getRnd(0, 1200);
  let y = getRnd(0, 50);
  let spr = createSprite(x, y);
  spr.velocity.y = getRnd(1, 2);
  let t = getRnd(0, 1);
  if (t == 0){
    spr.addAnimation ('type1',
          "../assets/n1.png",
          "../assets/n2.png",
          "../assets/n3.png"

    );
  } else {
    spr.addAnimation ('type2',
          "../assets/n4.png",
          "../assets/n5.png",
          "../assets/n6.png"
    );
  }
  spr.life = 500;
  return spr;
}

function updateNutrients(){
  for (let p = nutrGroup.length - 1; p >= 0; p--)
  {
    if (nutrGroup[p].overlap(ship.sprite)){
      if (ship.sprite.getAnimationLabel() == 'beamC' && nutrGroup[p].getAnimationLabel() == 'type1') {
        nutrGroup[p].remove();
        playerScore ++;
      }

      if (ship.sprite.getAnimationLabel() == 'beamTr' && nutrGroup[p].getAnimationLabel() == 'type2') {
        nutrGroup[p].remove();
        playerScore ++;
      }

    }
    /*if (nutrGroup[p].y > 0 && nutrGroup[p].y < 900){

    }*/
  }

  if (nutrGroup.length < 2 && nutrGroup.length >= 0){
    let newNutr = generateNutrSprite();
    nutrGroup.add(newNutr);
  }
}




// Got the list of ports
function gotList(thelist) {
  print("List of Serial Ports:");
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  print("Serial Port is Open");
}

function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  let latestData = serial.readString().trim();  // read the incoming string
  if( latestData !== '') {
    sensor_data = sensor_data.concat(latestData);
  } else {
    sensor_data = '';
  }
}
