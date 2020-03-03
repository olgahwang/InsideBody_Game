//debugging
var showDebugMessages = false;

//media
let shipImage, bgImage;
let circeRounded;
let windowWidth = innerWidth,
  windowHeight = innerHeight;

//ship, nutrients and bacterias
var firingRate = 25; //  <--- tells you how often you can shoot a lazer
var nutrGroup, bactGroup;
var food = [];
var lazers = [];
let nutriCount = 5;
let ship, shipX, shipY;
let newBac;
let barWidth = 10;
let explosionStart = -1;

//score and time
let playerScore, time;


//data
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
var portName = '/dev/tty.usbmodem14201';
let cur = 0, prev = 0;
let sensor_data = '';


function preload() {
  //cirTexture = loadImage("../assets/1.png");
  sqTexture = loadImage("../assets/tr1.png");
  bgImage = loadImage("../assets/new/bg2.png");
  shipImage = loadImage("../assets/new/claw.png");
  shipX = windowWidth * 0.4;
  shipY = windowHeight * 0.73;
  playerScore = 0;
  circeRounded = loadFont('../fonts/CirceRounded.otf');
  nutrGroup = new Group();
  bactGroup = new Group();
  lazersGroup = new Group();
  food[0] = new Apple;
}

function setup() {

  let myCanvas = createCanvas(windowWidth, windowHeight);
  myCanvas.parent("myCanvas");
  background(bgImage);
  ship = new Ship(shipImage, shipX, shipY);
  pX = getRnd(0, 1100);
  pY = getRnd(0, 200);
  score = 0;
  console.log(food[0].trNum+food[0].cirNum);

    let count = food[0].trNum + food[0].cirNum;
    let tr = food[0].trNum;
    let cir = food[0].cirNum;
    while (count != 0){
      let type = getRnd(0,1);
      console.log("Inside while");
      if (type == 0 && tr > 0) {
        nutrGroup.add(generateNutrSprite(0));
        count--;
        tr--;
      }
      if (type == 1 && cir > 0){
        nutrGroup.add(generateNutrSprite(1));
        count--;
        cir--;
      }
    }

  /*for (i = 0; i < 5; i++) {
    let newNutr = generateNutrSprite();
    nutrGroup.add(newNutr);
  }*/
  //data
  serial = new p5.SerialPort();
  serial.list();
  serial.open(portName);
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);
  //newBac = generateBactSprite();
}

function draw() {
  background(bgImage);
  time = parseInt(frameCount / 60);
  //checkBacteria();
  let ship_position = parseFloat(sensor_data);
  if(ship_position){
    ship.draw(ship_position);
  } else {
    ship.draw(0);
  }
  //console.log(time % 5);
  if (time % 5 == 0){
    if (bactGroup.length < 2) {
      newBac = generateBactSprite();
      bactGroup.add(newBac);
    }
  }

  if (nutrGroup.length < 6 && nutriCount < 200) {
    nutrGroup.add(generateNutrSprite());
    nutriCount++;
    barWidth+=1;
  }
  bacNutrOverlap();
  updateBacteria();
  updateNutrients();
  fill(224, 75, 55);
  textFont(circeRounded);
  textAlign(CENTER);
  textSize(50);
  text(playerScore, innerWidth*0.58, innerHeight*0.88);
  drawSprites(nutrGroup, bactGroup);
  fill(56, 64, 143);
  noStroke();
  //barWidth = map(score, 0, 200, 10, 150, true);
  //console.log(barWidth);
  rect(innerWidth*0.56, innerHeight*0.94,barWidth, 35);
}



function getRnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function serverConnected() {
  print("Connected to Server");
}

//Bad guys There
function generateBactSprite(){
  let x = getRnd(0, 1200);
  let y = getRnd(100, 500);
  let spr = createSprite(x, y);
  spr.addAnimation('type1', "../assets/b1.png", "../assets/b2.png", "../assets/b3.png");
  spr.addAnimation('explosion', "../assets/bb1.png", "../assets/bb2.png", "../assets/bb3.png",
                                "../assets/bb4.png", "../assets/bb5.png", "../assets/bb6.png",
                                "../assets/bb7.png", "../assets/bb8.png", "../assets/bb9.png",
                  );
  return spr;
}


function updateBacteria(){
  var z = -1;
  for (let i = lazers.length - 1; i >= 0; i--) {
    lazers[i].draw();
    if (!lazers[i].update()) {
      lazers.splice(i, 1);
      if (showDebugMessages) {
        console.log("Lazer #" + i + " left the screen!");
      }
    } else {
        for (let j = bactGroup.length - 1; j >= 0; j--)
        {

          let distance = sqrt(pow(lazers[i].x-25 - bactGroup[j].position.x, 2) + pow(lazers[i].y - bactGroup[j].position.y, 2));
          if (distance <= 40)
          {
            lazers.splice(i, 1);
            bactGroup[j].changeAnimation('explosion');
            explosionStart = 9;
            bactGroup[j].life = 9;
            break;
          }
        }
      }
  }

}

// Nutrients here
function generateNutrSprite(t){
  let x = getRnd(0, 1200);
  let y = getRnd(0, 50);
  let spr = createSprite(x, y);
  spr.velocity.y = getRnd(1, 2);
  t = getRnd(0,1);
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
  spr.life = 280;
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
    /*for (let i = bactGroup.length - 1; i >= 0; i--){
        if (nutrGroup[p].overlap(bactGroup[i])){
          bactGroup[i].scale += 0.1;
          nutrGroup[p].remove();
          break;
        }
    }*/
  }

  /*if (nutrGroup.length < 2 && nutrGroup.length >= 0){
    let newNutr = generateNutrSprite();
    nutrGroup.add(newNutr);
  }*/
}

function bacNutrOverlap(){
    for (let j = nutrGroup.length - 1; j>=0; j--){
      for (let i = bactGroup.length - 1; i >= 0; i--){
          if (nutrGroup[j].overlap(bactGroup[i])){
            bactGroup[i].scale += 0.1;
            nutrGroup[j].remove();
            break;
          }
    }
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
