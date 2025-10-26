const playerImg = document.querySelector('#playerImg');
const gameWindow = document.querySelector('.gameWindow');
const startButton = document.getElementById('startButton');
const startOverlay = document.getElementById('startOverlay');

let jumpCount = 0;
let playerBottom = 0;
let velocityY = 0; 
let originalHeight = playerImg.height;      
const jumpStrength = 10; 
const gravity = 0.15;     
const maxJumps = 2;
const ceiling = gameWindow.offsetHeight - playerImg.offsetHeight;

let animationId; // Variable to store the animation frame ID
let isGameOver = false; // Flag to prevent multiple collision triggers

let score = 0; // Initialize score
const scoreDisplay = document.createElement('div'); // Create score display
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.right = '10px';
scoreDisplay.style.color = 'white';
scoreDisplay.style.fontFamily = "'Press Start 2P', monospace";
scoreDisplay.style.fontSize = '12px';
scoreDisplay.textContent = `Score: ${score}`;
document.body.appendChild(scoreDisplay);

let kittySpawnInterval = 5000; // Initial interval for kitty appearance (5 seconds)

function updateScore() {
  if (!isGameOver) {
    score += 1; // Increment score by 1
    scoreDisplay.textContent = `Score: ${score}`;
    setTimeout(updateScore, 100); // Update score every 1/10th of a second
  }
}

function resetScore() {
  score = 0; // Reset score
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
  resetScore(); // Reset score when game restarts
  startOverlay.style.display = 'none';
  animationId = requestAnimationFrame(gameLoop); // Restart the game loop
  updateScore(); // Start updating the score
  manageKitties(); // Start managing kitties
}

function checkCollision() {
  if (isGameOver) return; // Skip collision checks if the game is over

  const playerRect = playerImg.getBoundingClientRect();
  const kittyRect = document.querySelector('#kittyImg').getBoundingClientRect();

  if (
    playerRect.left < kittyRect.right &&
    playerRect.right > kittyRect.left &&
    playerRect.top < kittyRect.bottom &&
    playerRect.bottom > kittyRect.top
  ) {
    // Collision detected
    isGameOver = true; // Set the flag to prevent further checks
    cancelAnimationFrame(animationId); // Stop the game loop
    startOverlay.style.display = 'flex'; // Show the start overlay
    setTimeout(() => {
      isGameOver = false; // Reset the flag
      restartGame();
    }, 2000); // Restart the game after a delay
  }
}

function gameLoop() {
	//Gravity effect
	if(playerBottom > 0 || velocityY > 0) {
		velocityY -= gravity; //effect of gravity
		playerBottom += velocityY; //bottom of player img going up
		
		//Stop player from going down under window
		if(playerBottom <= 0) {
			playerBottom = 0;
			velocityY = 0;
			jumpCount = 0;
		}
		
		//Stop player from disappearing into top of window
		if(playerBottom >= ceiling) {
			playerBottom = ceiling;
			velocityY = 0;
		}
		
		//Change position of the player
		playerImg.style.bottom = `${playerBottom}px`;
	}
	
	checkCollision(); // Check for collision in each frame

	animationId = requestAnimationFrame(gameLoop); // Save the animation frame ID
}

gameLoop();

//Listen for arrow up and spacebar key presses
document.addEventListener('keydown', function(event) {
	//Check that arrowup or spacebar was pressed and that max jumps is not surprassed 
	if((event.key === "ArrowUp" || event.key === " ") && jumpCount < maxJumps) {
		velocityY = jumpStrength;
		jumpCount++;
	}
	
	//Check that arrowdown was pressed
	if(event.key === "ArrowDown") {
		if(playerBottom > 0) {
			velocityY -= jumpStrength * 1;
		} else {
			playerImg.height = originalHeight/2;
		}
	}
	
});


//Listen for key releases
document.addEventListener('keyup', function(event) {
	//Check that arrowdown was released
	if(event.key === "ArrowDown") {
		playerImg.height = originalHeight;
	}
});

//Listen for initial click to start game
startButton.addEventListener('click', () => {
  // Flicker effect before starting
  gameWindow.style.animation = 'glow 0.1s infinite alternate';
  
  setTimeout(() => {
    startOverlay.style.display = 'none';
    gameWindow.style.animation = 'glow 2s infinite alternate';
  }, 100); 
  updateScore(); // Start updating the score when the game starts
  manageKitties(); // Start managing kitties
});
const ground = document.getElementById('ground');

// Initialize the background position
let backgroundPosition = 0;

function spawnKitty() {
  const newKitty = document.createElement('img');
  newKitty.src = 'assets/kitty.png';
  newKitty.classList.add('kitty'); // Add a class for styling
  newKitty.style.position = 'absolute';
  newKitty.style.right = '10%';
  newKitty.style.bottom = '0';
  newKitty.style.width = '50px';
  newKitty.style.height = '70px';
  newKitty.style.zIndex = '6';
  gameWindow.appendChild(newKitty);

  // Move the kitty across the screen
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



