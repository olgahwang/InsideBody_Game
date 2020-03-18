//debugging
var showDebugMessages = false;

//media
let shipImage, bgImage;
let circeRounded;
let windowWidth = innerWidth,
  windowHeight = innerHeight;
let zapSound, nutrSound, bactSound, beamSound;

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
  bgImage = loadImage("../assets/backgroundGood.jpg");
  shipImage = loadImage("../assets/char2.png");
  shipX = windowWidth * 0.4;
  shipY = windowHeight * 0.765;
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
  zapSound = loadSound('../sounds/shoot.mp3');
  nutrSound = loadSound('../sounds/hit.mp3');
  bactSound = loadSound('../sounds/explosion.mp3');
  beamSound = loadSound('../sounds/pick.mp3');
  console.log(zapSound);
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

  if (nutrGroup.length < 3 && nutriCount < 200) {
    nutrGroup.add(generateNutrSprite());
    nutriCount++;
    //barWidth+=1;
  }
  bacNutrOverlap();
  updateBacteria();
  updateNutrients();
  fill(224, 75, 55);
  textFont(circeRounded);
  textAlign(CENTER);
  textSize(50);
  //text(playerScore, innerWidth*0.58, innerHeight*0.88);
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
  let x = getRnd(innerWidth*0.17, innerWidth-innerWidth*0.18);
  let y = getRnd(100, 500);
  let spr = createSprite(x, y);
  spr.scale = 0.7;
  let tp = getRnd(0,2);
  if (tp == 0){
    spr.addAnimation ('t1-normal',
          "../assets/new/bg-purple-1.png");
    spr.addAnimation ('t1-explosion',
    "../assets/new/bg-purple-1.png", "../assets/new/bg-purple-2.png", "../assets/new/bg-purple-3.png",
     "../assets/new/bg-purple-4.png", "../assets/new/bg-purple-5.png");
  }
  if (tp == 1){
    spr.addAnimation ('t2-normal',
          "../assets/new/bg-orange-1.png");
    spr.addAnimation ('t2-explosion',
    "../assets/new/bg-orange-1.png", "../assets/new/bg-orange-2.png", "../assets/new/bg-orange-3.png",
     "../assets/new/bg-orange-4.png", "../assets/new/bg-orange-5.png");
  }

  if (tp == 2){
    spr.addAnimation ('t3-normal',
          "../assets/new/bg-blue-1.png");
    spr.addAnimation ('t3-explosion',
    "../assets/new/bg-blue-1.png", "../assets/new/bg-blue-2.png", "../assets/new/bg-blue-3.png",
     "../assets/new/bg-blue-4.png", "../assets/new/bg-blue-5.png");
  }
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
            if (bactGroup[j].getAnimationLabel() == 't1-normal'){
              bactGroup[j].changeAnimation('t1-explosion');
            }
            if (bactGroup[j].getAnimationLabel() == 't2-normal'){
              bactGroup[j].changeAnimation('t2-explosion');
            }
            if (bactGroup[j].getAnimationLabel() == 't3-normal'){
              bactGroup[j].changeAnimation('t3-explosion');
            }
            explosionStart = 9;
            bactGroup[j].life = 11;
            bactSound.play();
            break;
          }
        }
      }
  }

}

// Nutrients here
function generateNutrSprite(t){
  let x = getRnd(innerWidth*0.17, innerWidth-innerWidth*0.18);
  let y = getRnd(0, 50);
  let spr = createSprite(x, y);
  spr.velocity.y = getRnd(1, 2);
  t = getRnd(0,1);
  if (t == 0){
    spr.addAnimation ('type1',
          "../assets/new/c.png"

    );
  } else {
    spr.addAnimation ('type2',
          "../assets/n4.png",
          "../assets/n5.png",
          "../assets/n6.png"
    );
  }
  return spr;
}

function updateNutrients(){
  for (let p = nutrGroup.length - 1; p >= 0; p--)
  {
    if (nutrGroup[p].overlap(ship.sprite)){
      if (ship.sprite.getAnimationLabel() == 'beamC' && nutrGroup[p].getAnimationLabel() == 'type1') {
        nutrGroup[p].remove();
        playerScore ++;
        barWidth+=5;
      }

      if (ship.sprite.getAnimationLabel() == 'beamTr' && nutrGroup[p].getAnimationLabel() == 'type2') {
        nutrGroup[p].remove();
        playerScore ++;
        barWidth+=5;
        nutrSound.play();
      }

    }
    console.log(nutrGroup[p].position.y);
    if (nutrGroup[p].position.y > innerHeight*0.8){
      nutrGroup[p].life = 0;
    }
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
