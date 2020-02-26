class GoodNutrient {
  constructor(x, y) {
    this.type = getRnd(0,1);
    this.x = x;
    this.y = y;
    this.sprite = createSprite(this.x, this.y);
    this.sprite.velocity.y = getRnd(1,2);
    this.scaleVal = 1;
    if (this.type == 0){
      //Type 1
      this.sprite.addAnimation ('normal',
            "../assets/n1.png",
            "../assets/n2.png",
            "../assets/n3.png"

      );
      //console.log("Type 0");
    }
    else if (this.type == 1) {
      //Type 2
      this.sprite.addAnimation ('normal',
            "../assets/n4.png",
            "../assets/n5.png",
            "../assets/n6.png"
      );
      //console.log("Type 1");
    }
  }

  remove() {
    this.sprite.remove();
  }

  getPositionY() {
    return this.sprite.position.y;
  }

  getPositionX() {
    return this.sprite.position.x;
  }

  draw() {
    push();
    scale(1);
    drawSprites();
  }

}
