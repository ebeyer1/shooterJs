function Bullet(x, y) {
  this.pos = new Vector(x, y)

  this.move = function (dy) {
    this.pos.setY(this.pos.y + dy);
  }
}
