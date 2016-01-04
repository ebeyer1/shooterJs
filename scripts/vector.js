function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.setY = setY;
  this.setCoords = setCoords;

  function setY(y) {
    this.y = y;
  }

  function setCoords(x, y) {
    this.x = x;
    this.y = y;
  }
}
