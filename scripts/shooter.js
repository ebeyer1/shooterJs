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
var SHIP_HEIGHT = 25;
var SHIP_WIDTH = 40;
var ship = new Ship((canvas.width/2)-(SHIP_WIDTH/2), canvas.height, SHIP_WIDTH, SHIP_HEIGHT);

var flySpeed = 3;

// bullet stuffs
var BULLET_WIDTH = 2;
var BULLET_HEIGHT = 5;

var BULLET_SPEED = -2;

var canShootBullet = true;
var delayForNextBullet = 500;

// enemy input
var ENEMY_WIDTH = 60;
var ENEMY_HEIGHT = 25;

var enemyXOffset = 50;
var enemyYPosition = 50;
var enemyWorth = 100;
var enemies = [
  new Enemy(enemyXOffset, enemyYPosition, ENEMY_WIDTH, ENEMY_HEIGHT, enemyWorth),
  new Enemy(canvas.width*1/3+enemyXOffset, enemyYPosition, ENEMY_WIDTH, ENEMY_HEIGHT, enemyWorth),
  new Enemy(canvas.width*2/3+enemyXOffset, enemyYPosition, ENEMY_WIDTH, ENEMY_HEIGHT, enemyWorth)
];

// explosion stuffs

var particles = [];

// user input
var leftPressed = false;
var rightPressed = false;
var spacePressed = false;

var bulletList = [];

function drawShip() {
  ship.draw(ctx);
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
  var x = ship.pos.x+(ship.width/2)-(BULLET_WIDTH/2);
  var y = ship.pos.y-ship.height-BULLET_HEIGHT;
  var bullet = new Bullet(x, y, BULLET_WIDTH, BULLET_HEIGHT, BULLET_SPEED);
  bulletList.push(bullet);
  disableBullet();

  setTimeout(enableBullet, delayForNextBullet);
}

function explodeEnemy(x, y) {
  for (var angle = 0; angle < 360; angle += PARTICLE_ANGLE_ITERATION) {
    var particle = new Particle();
    particle.setPos(x,y);

    var colorIndex = Math.floor(randomFloat(0,PARTICLE_COLORS.length));
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
    bullet.update(DRAW_TIMER);

    if (bullet.pos.y > BULLET_HEIGHT) {
      bulletsOnScreen.push(bullet);
    }

    var tempEnemyList = [];
    // can easily be optimized. Just get something working
    enemies.forEach(function (enemy) {
      if (bullet.pos.y <= enemy.pos.y + enemy.height &&
          bullet.pos.x >= enemy.pos.x && bullet.pos.x <= enemy.pos.x + enemy.width) {
        // killed.
        bulletsOnScreen.pop(); // remove bullet since it hit something
        score += enemy.worth;
        scoreDiv.innerHTML = "Score: " + score;

        // explode
        explodeEnemy(enemy.pos.x + (enemy.width/2), enemy.pos.y + (enemy.height/2));
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

    bullet.draw(ctx);
  });

  // refresh list to remove items who've gone off screen
  bulletList = bulletsOnScreen;
}

function drawEnemies() {
  enemies.forEach(function (enemy) {
    enemy.draw(ctx);
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
  if (leftPressed && ship.pos.x > 0) {
    ship.pos.x -= flySpeed;
  }

  if (rightPressed && ship.pos.x < canvas.width-ship.width) {
    ship.pos.x += flySpeed;
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
