class Ship {
  constructor(shipImage, x, y) {
    this.x = x;
    this.y = y;
    this.trashNum = 0;
    this.shipImage = shipImage;
    this.shootDelay = 0;
    this.maxShootDelay = firingRate;
  }

  draw() {
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

    if (keyIsDown(UP_ARROW)) {
      if (this.shootDelay === 0) {
        this.shootDelay = this.maxShootDelay;
        lazers.push(new Lazer(this.x, this.y));
      }
    }
    let shipW = 70;
    let shipH = 130;
    image(shipImage, this.x - shipW / 2, this.y - shipH / 2, shipW, shipH);
    pop();
  }
}
