function Particle() {
  // default props
  this.scale = 1.0;
  this.pos = new Vector(0, 0);
  this.radius = 20;
  this.color = "#000";
  this.velocityX = 0;
  this.velocityY = 0;
  this.scaleSpeed = 0.5;

  // methods
  this.setPos = setPos;
  this.setColor = setColor;
  this.setVelocity = setVelocity;
  this.setRadius = setRadius;
  this.setScaleSpeed = setScaleSpeed;
  this.shouldDraw = shouldDraw;
  this.update = update;
  this.draw = draw;

  function setPos(x, y) {
    this.pos.setCoords(x, y);
  }

  function setColor(color) {
    this.color = color;
  }

  function setVelocity(velocityX, velocityY) {
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  function setRadius(radius) {
    this.radius = radius;
  }

  function setScaleSpeed(scaleSpeed) {
      this.scaleSpeed = scaleSpeed;
  }

  function shouldDraw() {
    return this.scale > 0;
  }

  function update(ms) {
    // shrinking
    this.scale -= this.scaleSpeed * ms / 1000.0;

    if (this.scale <= 0) {
      this.scale = 0;
    }

    // moving away from explosion center
    var newX = this.pos.x + this.velocityX * ms / 1000.0;
    var newY = this.pos.y + this.velocityY * ms / 1000.0;
    this.pos.setCoords(newX, newY);
  }

  function draw(context) {
    // translating the context to the particle coordinates
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.scale(this.scale, this.scale);

    // drawing a filled circle in the particle's local space
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI*2, true);
    context.closePath();

    context.fillStyle = this.color;
    context.fill();

    context.restore();
  }
}
