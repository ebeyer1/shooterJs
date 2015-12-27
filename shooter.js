var canvas = document.getElementById("js-canvas");
canvas.setAttribute('width', 480);
canvas.setAttribute('height', 320);

var ctx = canvas.getContext("2d");

// ship stuffs
var shipHeight = 25;
var shipWidth = 40;
var shipX = (canvas.width/2)-(shipWidth/2); // middle
var shipY = canvas.height; // bottom of screen
var shipIndentOffset = 3;

var flySpeed = 3;

// bullet stuffs
var bulletWidth = 2;
var bulletHeight = 5;

var bulletSpeed = 2;

var canShootBullet = true;
var delayForNextBullet = 500;

// user input
var leftPressed = false;
var rightPressed = false;
var spacePressed = false;

var bulletList = [];

function drawShip() {
  ctx.beginPath();
  ctx.moveTo(shipX,shipY);
  ctx.lineTo(shipX+(shipWidth/4)+shipIndentOffset,shipY-(shipHeight/3));
  ctx.lineTo(shipX+(shipWidth/2),shipY-shipHeight);
  ctx.lineTo(shipX+(shipWidth*3/4)-shipIndentOffset,shipY-(shipHeight/3));
  ctx.lineTo(shipX+shipWidth, shipY);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function Bullet(x, y) {
  this.pos = {
    x: x,
    y: y
  }

  this.setY = function (y) {
    this.pos.y = y;
  }
}

function disableBullet() {
  canShootBullet = false;
}

function enableBullet() {
  canShootBullet = true;
};

function shootBullet() {
  var x = shipX+(shipWidth/2)-(bulletWidth/2);
  var y = shipY-shipHeight-bulletHeight;
  bulletList.push(new Bullet(x, y));
  disableBullet();

  setTimeout(enableBullet, delayForNextBullet);
}

function drawBullets() {
  var bulletsOnScreen = [];

  bulletList.forEach(function (bullet) {
    var newBulletY = bullet.pos.y-bulletSpeed;
    if (newBulletY > bulletHeight) {
      bulletsOnScreen.push(bullet);
    }
    bullet.setY(newBulletY);

    ctx.beginPath();
    ctx.rect(bullet.pos.x,bullet.pos.y,bulletWidth,bulletHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  });

  // refresh list to remove items who've gone off screen
  bulletList = bulletsOnScreen;
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // move ship pos
  if (leftPressed && shipX > 0) {
    shipX -= flySpeed;
  }

  if (rightPressed && shipX < canvas.width-shipWidth) {
    shipX += flySpeed;
  }

  if (spacePressed && canShootBullet) {
    shootBullet();
  }

  drawShip();
  drawBullets();
}

var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var SPACE_BAR = 32;

function keyDownHandler(e) {
  if(e.keyCode === RIGHT_KEY) {
    rightPressed = true;
  }
  else if(e.keyCode === LEFT_KEY) {
    leftPressed = true;
  }
  else if(e.keyCode === SPACE_BAR) {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode === RIGHT_KEY) {
    rightPressed = false;
  }
  else if(e.keyCode === LEFT_KEY) {
    leftPressed = false;
  }
  else if(e.keyCode === SPACE_BAR) {
    spacePressed = false;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
setInterval(draw, 10);
