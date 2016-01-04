// Game variables

var DRAW_TIMER = 10;
var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var SPACE_BAR = 32;

// particle variables

var MIN_PARTICLE_SIZE = 6;
var MAX_PARTICLE_SIZE = 18;
var PARTICLE_COUNT = 12;
var MIN_PARTICLE_SPEED = 60.0;
var MAX_PARTICLE_SPEED = 180.00;
var MIN_PARTICLE_SCALE_SPEED = 3.0;
var MAX_PARTICLE_SCALE_SPEED = 4.8;

var PARTICLE_ANGLE_ITERATION = Math.round(360/PARTICLE_COUNT);

var PARTICLE_COLORS = ["red", "green"];

// canvas

var canvas = document.getElementById("js-canvas");
canvas.setAttribute('width', 480);
canvas.setAttribute('height', 320);

var ctx = canvas.getContext("2d");

var scoreDiv = document.getElementById("js-score");

// score
var score = 0;

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

var bulletSpeed = -2;

var canShootBullet = true;
var delayForNextBullet = 500;

// enemy input
var enemyWidth = 60;
var enemeyHeight = 25;

var enemyXOffset = 50;
var enemyYPosition = 50;
var enemyWorth = 100;
var enemies = [
  new Enemy(enemyXOffset, enemyYPosition, enemyWorth),
  new Enemy(canvas.width*1/3+enemyXOffset, enemyYPosition, enemyWorth),
  new Enemy(canvas.width*2/3+enemyXOffset, enemyYPosition, enemyWorth)
];

// explosion stuffs

var particles = [];

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

function randomFloat(min, max) {
  return min + Math.random()*(max-min);
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

function explodeEnemy(x, y) {
  for (var angle = 0; angle < 360; angle += PARTICLE_ANGLE_ITERATION) {
    var particle = new Particle();
    particle.setPos(x,y);

    var colorIndex = Math.round(randomFloat(0,PARTICLE_COLORS.length));
    var color = PARTICLE_COLORS[colorIndex];
    particle.setColor(color);

    var radius = randomFloat(MIN_PARTICLE_SIZE, MAX_PARTICLE_SIZE);
    particle.setRadius(radius);

    var scaleSpeed = randomFloat(MIN_PARTICLE_SCALE_SPEED, MAX_PARTICLE_SCALE_SPEED);
    particle.setScaleSpeed(scaleSpeed);

    var speed = randomFloat(MIN_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
    var velocityX = speed * Math.cos(angle * Math.PI / 180.0);
    var velocityY = speed * Math.sin(angle * Math.PI / 180.0);
    particle.setVelocity(velocityX, velocityY);

    particles.push(particle);
  }
}

function drawBullets() {
  var bulletsOnScreen = [];

  bulletList.forEach(function (bullet) {
    bullet.move(bulletSpeed);

    if (bullet.pos.y > bulletHeight) {
      bulletsOnScreen.push(bullet);
    }

    var tempEnemyList = [];
    // can easily be optimized. Just get something working
    enemies.forEach(function (enemy) {
      if (bullet.pos.y <= enemy.pos.y + enemeyHeight &&
          bullet.pos.x >= enemy.pos.x && bullet.pos.x <= enemy.pos.x + enemyWidth) {
        // killed.
        bulletsOnScreen.pop(); // remove bullet since it hit something
        score += enemy.worth;
        scoreDiv.innerHTML = "Score: " + score;

        // explode
        explodeEnemy(enemy.pos.x + (enemyWidth/2), enemy.pos.y + (enemeyHeight/2));
      } else {
        tempEnemyList.push(enemy);
      }
    });

    if (enemies.length !== tempEnemyList.length) {
      enemies = tempEnemyList;

      if (enemies.length === 0) {
        // Game over. You win.
        clearInterval(drawIntervalId);
        clearCanvas();
        drawShip();
        alert("You win! Refresh to play again.");
      }
    }

    ctx.beginPath();
    ctx.rect(bullet.pos.x,bullet.pos.y,bulletWidth,bulletHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  });

  // refresh list to remove items who've gone off screen
  bulletList = bulletsOnScreen;
}

function drawEnemies() {
  enemies.forEach(function (enemy) {
    ctx.beginPath();
    ctx.rect(enemy.pos.x,enemy.pos.y,enemyWidth,enemeyHeight);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
  });
}

function drawExplosions() {
  var newParticleList = [];

  particles.forEach(function (particle) {
    particle.update(DRAW_TIMER);
    if (particle.shouldDraw()) {
      particle.draw(ctx);
      newParticleList.push(particle);
    }
  });

  particles = newParticleList;
}

function clearCanvas() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function draw() {
  clearCanvas();

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
  drawEnemies();
  drawExplosions(); // should be part of the enemy stuff...
  drawBullets();
}

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
var drawIntervalId = setInterval(draw, DRAW_TIMER);
