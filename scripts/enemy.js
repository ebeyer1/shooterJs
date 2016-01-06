function Enemy(x, y, width, height, worth) {
  // properties
  this.pos = new Vector(x,y);
  this.width = width;
  this.height = height;
  this.worth = worth;

  // methods
  this.draw = draw;

  function draw(context) {
    context.save();

    context.beginPath();
    var enemyWidthColumns = 7;
    var enemyColumnWidth = this.width / enemyWidthColumns;

    // creating a curved winged ship enemy (|-|)
    var sectionWidth = enemyColumnWidth * ((enemyWidthColumns-1)/2);
    var sectionHeight = this.height;
    var startX = this.pos.x + sectionWidth;
    var startY = this.pos.y;

    // first curved section on the left
    context.moveTo(startX, startY);
    context.bezierCurveTo(startX - sectionWidth, startY, startX - sectionWidth, startY + sectionHeight, startX, startY + sectionHeight);

    // middle section connecting curved bits
    sectionHeight = this.height / 3;
    sectionWidth = enemyColumnWidth;
    startY += sectionHeight;
    context.moveTo(startX, startY);
    context.lineTo(startX + sectionWidth, startY);
    context.lineTo(startX + sectionWidth, startY + sectionHeight);
    context.lineTo(startX, startY + sectionHeight);

    // last curved section on the right
    startX += sectionWidth;
    startY = this.pos.y;
    sectionWidth = enemyColumnWidth * ((enemyWidthColumns-1)/2);
    sectionHeight = this.height;
    context.moveTo(startX, startY);
    context.bezierCurveTo(startX + sectionWidth, startY, startX + sectionWidth, startY + sectionHeight, startX, startY + sectionHeight);

    context.fillStyle = "green";
    context.fill();
    context.closePath();

    context.restore();
  }
}
