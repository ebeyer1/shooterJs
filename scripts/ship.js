function Ship(x, y, width, height) {
  var shipIndentOffset = 3;

  this.pos = new Vector(x, y);
  this.width = width;
  this.height = height;

  this.draw = draw;

  function draw(context) {
    context.save();

    context.beginPath();
    context.moveTo(this.pos.x,this.pos.y);
    context.lineTo(this.pos.x+(this.width/4)+shipIndentOffset,this.pos.y-(this.height/3));
    context.lineTo(this.pos.x+(this.width/2),this.pos.y-this.height);
    context.lineTo(this.pos.x+(this.width*3/4)-shipIndentOffset,this.pos.y-(this.height/3));
    context.lineTo(this.pos.x+this.width, this.pos.y);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();

    context.restore();
  }
}
