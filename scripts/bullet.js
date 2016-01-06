function Bullet(x, y, width, height, bulletSpeed) {
  // properties
  this.pos = new Vector(x, y)
  this.width = width;
  this.height = height;
  this.bulletSpeed = bulletSpeed;

  // methods
  this.update = update;
  this.draw = draw;

  function update(ms) {
    this.pos.setY(this.pos.y + this.bulletSpeed);
  }

  function draw(context) {
    context.save();

    context.beginPath();
    context.rect(this.pos.x,this.pos.y,this.width,this.height);
    context.fillStyle = "red";
    context.fill();
    context.closePath();

    context.restore();
  }
}
