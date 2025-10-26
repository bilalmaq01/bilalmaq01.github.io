const playerImg = document.querySelector('#playerImg');
const gameWindow = document.querySelector('.gameWindow');
const startButton = document.getElementById('startButton');
const startOverlay = document.getElementById('startOverlay');
let jumpCount = 0;
let playerBottom = 0;
let velocityY = 0;
const jumpStrength = 10;
const gravity = 0.15;
const maxJumps = 2;
const ceiling = gameWindow.offsetHeight - playerImg.offsetHeight;
let animationId;
let isGameOver = false;
let score = 0;
const scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.right = '10px';
scoreDisplay.style.color = 'white';
scoreDisplay.style.fontFamily = "'Press Start 2P', monospace";
scoreDisplay.style.fontSize = '12px';
scoreDisplay.textContent = `Score: ${score}`;
document.body.appendChild(scoreDisplay);
let kittySpawnInterval = 5000;
function updateScore() {
  if (!isGameOver) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
    setTimeout(updateScore, 100);
  }
}
function resetScore() {
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
}
function resetPlayer() {
  playerBottom = 0;
  velocityY = 0;
  jumpCount = 0;
  playerImg.style.bottom = `${playerBottom}px`;
}
function resetKitty() {
  const kitty = document.querySelector('#kittyImg');
  kitty.style.left = '100%';
}
function restartGame() {
  resetPlayer();
  resetKitty();
  resetScore();
  startOverlay.style.display = 'none';
  animationId = requestAnimationFrame(gameLoop);
  updateScore();
  manageKitties();
}
function checkCollision() {
  if (isGameOver) return;
  const playerRect = playerImg.getBoundingClientRect();
  const kitties = document.querySelectorAll('.kitty');
  kitties.forEach((kitty) => {
    const kittyRect = kitty.getBoundingClientRect();
    if (
      playerRect.left < kittyRect.right &&
      playerRect.right > kittyRect.left &&
      playerRect.top < kittyRect.bottom &&
      playerRect.bottom > kittyRect.top
    ) {
      isGameOver = true;
      cancelAnimationFrame(animationId);
      startOverlay.style.display = 'flex';
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    }
  });
}
function gameLoop() {
  if (playerBottom > 0 || velocityY > 0) {
    velocityY -= gravity;
    playerBottom += velocityY;
    if (playerBottom <= 0) {
      playerBottom = 0;
      velocityY = 0;
      jumpCount = 0;
    }
    if (playerBottom >= ceiling) {
      playerBottom = ceiling;
      velocityY = 0;
    }
    playerImg.style.bottom = `${playerBottom}px`;
  }
  checkCollision();
  animationId = requestAnimationFrame(gameLoop);
}
gameLoop();
document.addEventListener('keydown', function(event) {
  if ((event.key === "ArrowUp" || event.key === " ") && jumpCount < maxJumps) {
    velocityY = jumpStrength;
    jumpCount++;
  }
  if (event.key === "ArrowDown") {
    if (playerBottom > 0) {
      velocityY -= jumpStrength * 1;
    } else {
      playerImg.height = originalHeight / 2;
    }
  }
});
document.addEventListener('keyup', function(event) {
  if (event.key === "ArrowDown") {
    playerImg.height = originalHeight;
  }
});
startButton.addEventListener('click', () => {
  gameWindow.style.animation = 'glow 0.1s infinite alternate';
  setTimeout(() => {
    startOverlay.style.display = 'none';
    gameWindow.style.animation = 'glow 2s infinite alternate';
  }, 100);
  updateScore();
  manageKitties();
});
const ground = document.getElementById('ground');
let backgroundPosition = 0;
function spawnKitty() {
  const newKitty = document.createElement('img');
  newKitty.src = 'assets/kitty.png';
  newKitty.classList.add('kitty');
  newKitty.style.position = 'absolute';
  newKitty.style.right = '10%';
  newKitty.style.bottom = '0';
  newKitty.style.width = '50px';
  newKitty.style.height = '70px';
  newKitty.style.zIndex = '6';
  gameWindow.appendChild(newKitty);
  let kittyPosition = window.innerWidth + 10;
  function moveKitty() {
    if (isGameOver) {
      newKitty.remove(); // Remove kitty if the game is over
      return;
    }
    kittyPosition -= 2; // Adjust speed
    if (kittyPosition > -50) {
      newKitty.style.left = `${kittyPosition}px`;
      requestAnimationFrame(moveKitty);
    } else {
      newKitty.remove(); // Remove kitty after it leaves the screen
    }
  }
  moveKitty();
}
function manageKitties() {
  if (!isGameOver) {
    spawnKitty();
    if (score >= 200) {
      kittySpawnInterval = 3000; // Increase frequency after 200 points
    }
    setTimeout(manageKitties, kittySpawnInterval);
  }
}
document.addEventListener('DOMContentLoaded', function() {
  const playerImg = document.getElementById('playerImg');
  let currentImage = 'Frank_Motion1.png';
  setInterval(function() {
    if (currentImage === 'Frank_Motion1.png') {
      currentImage = 'Frank_Motion2.png';
    } else {
      currentImage = 'Frank_Motion1.png';
    }
    playerImg.src = `assets/${currentImage}`;
  }, 500); // Change image every 500 milliseconds
});
