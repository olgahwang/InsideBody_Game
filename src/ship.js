class Ship {
  constructor(shipImage, x, y) {
    this.x = x;
    this.y = y;
    this.trashNum = 0;
    this.shipImage = shipImage;
  }

  draw() {
    push();
    if (keyIsDown(LEFT_ARROW)) {
      if (this.x >=5){
        this.x -= 10;
      }
    }

    if (keyIsDown(RIGHT_ARROW)) {
      if (this.x <=1000){
        this.x += 10;
      }
    }
    image(shipImage, this.x, this.y, 70, 130);
    pop();
  }
}
