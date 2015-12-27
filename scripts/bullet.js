function Bullet(x, y) {
  this.pos = {
    x: x,
    y: y
  }

  this.setY = function (y) {
    this.pos.y = y;
  }
}
