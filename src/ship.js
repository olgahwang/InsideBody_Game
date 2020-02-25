class Ship {
  constructor(shipImage, x, y) {
    this.x = x;
    this.y = y;
    this.trashNum = 0;
    this.shipImage = shipImage;
    this.shootDelay = 0;
    this.maxShootDelay = firingRate;
  }

  draw(a) {
    var trBeam;
    trBeam = createSprite(400, 200, 10, 10);
    trBeam.life = -1;
    if (trBeam.life != -1){
      trBeam.addAnimation("beam",
      "../assets/beamTriangle.png",
      "../assets/beamTriangle2.png",
      "../assets/beamTriangle3.png",
      );
      trBeam.position.x = this.x;
      trBeam.position.y = this.y - 200;
    }
    if (this.shootDelay > 0) {
      this.shootDelay--;
    }
    push();
    if (keyIsDown(LEFT_ARROW)) {
      if (this.x >= 5) {
        this.x -= 10;
      }
    }

    if (keyIsDown(RIGHT_ARROW)) {
      if (this.x <= windowWidth - 5) {
        this.x += 10;
      }
    }

    if (keyIsDown(49)) {
    trBeam.life = 50;
      /*if (this.shootDelay === 0) {
        this.shootDelay = this.maxShootDelay;
        lazers.push(new Lazer(this.x+35, this.y));
      }*/
    }

    if (keyIsDown(50)){
      if (this.shootDelay === 0) {
        this.shootDelay = this.maxShootDelay;
        lazers.push(new Lazer(this.x+35, this.y));
      }
    }

    if (keyIsDown(51)){
      if (this.shootDelay === 0) {
        this.shootDelay = this.maxShootDelay;
        lazers.push(new Lazer(this.x+35, this.y));
      }
    }
    if (a > 0) {
      //console.log('SENSOR1: ' + a + ' - X: ' + this.x);
      if (this.x >= 5) {
        this.x -= 10;
      }
    }
    if (a < 0) {
      //console.log('SENSOR2: ' + a + ' - X: ' + this.x);
      if (this.x <= (innerWidth - 60)) {
        this.x += 10;
      }
  }
  let shipW = 70;
  let shipH = 130;
  image(shipImage, this.x, this.y, shipW, shipH);
  drawSprites();
  pop();
  }

  createLazer(){
    if (this.shootDelay === 0) {
      this.shootDelay = this.maxShootDelay;
      lazers.push(new Lazer(this.x+35, this.y));
    }
  }
}
