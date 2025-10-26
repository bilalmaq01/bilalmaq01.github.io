const playerImg = document.querySelector('#playerImg');
const gameWindow = document.querySelector('.gameWindow');
const deathOverlay = document.getElementById('deathOverlay');
const retryButton = document.getElementById('retryButton');
const skyback = document.getElementById('skyback');
const enableSoundButton = document.getElementById('enableSoundButton');
const soundOverlay = document.getElementById('soundOverlay');
const blackOverlay = document.getElementById('blackOverlay');
const introVideo = document.getElementById('introVideo');
const startOverlay = document.getElementById('startOverlay');
const startButton = document.getElementById('startButton');

let gameStarted = false;
let jumpCount = 0;
let playerBottom = 0;
let velocityY = 0; 
let originalHeight = playerImg.height; 
let scoreTimeoutId;
let kittyTimeoutId;     
const jumpStrength = 10; 
const gravity = 0.22;     
const maxJumps = 2;
const ceiling = gameWindow.offsetHeight - playerImg.offsetHeight;
playerImg.style.transformOrigin = "bottom";

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
let meteorSpawnInterval = 7000; // Initial interval for meteor appearance (7 seconds)


function updateScore() {
  if (!isGameOver) {
    score += 1; // Increment score by 1
    scoreDisplay.textContent = `Score: ${score}`;
    scoreTimeoutId = setTimeout(updateScore, 100); // Update score every 1/10th of a second
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
  playerImg.style.visibility = "visible";
  blackOverlay.style.display = 'none';
  startOverlay.style.display = 'none';
  // Clear and restart meteor spawning
    clearTimeout(meteorTimeoutId); // Ensure no lingering timeouts
    meteorTimeoutId = null;
  animationId = requestAnimationFrame(gameLoop); // Restart the game loop
  updateScore(); // Start updating the score
  manageKitties(); // Start managing kitties
  manageMeteors(); // Start managing meteors
}

function checkCollision() {
  if (isGameOver) return; // Skip collision checks if the game is over

  const playerRect = playerImg.getBoundingClientRect();
  const kitties = document.querySelectorAll('.kitty'); // Select all kitties
  const meteors = document.querySelectorAll('.meteor'); // Select all meteors
  
  kitties.forEach((kitty) => {
    const kittyRect = kitty.getBoundingClientRect();

    if (
      playerRect.left < kittyRect.right &&
      playerRect.right > kittyRect.left &&
      playerRect.top < kittyRect.bottom &&
      playerRect.bottom > kittyRect.top
    ) {
      // Collision detected
      isGameOver = true; // Set the flag to prevent further checks
	  gameStarted = false;
	  
	  cancelAnimationFrame(animationId); // Stop the game loop
	  clearTimeout(scoreTimeoutId);
	  clearTimeout(kittyTimeoutId);
	  
	  document.querySelectorAll('.kitty').forEach(k => k.remove()); //Stop kitty spawning
	  
	  deathOverlay.style.display = 'flex'; // Show the ending overlay
    }
  });
  
  meteors.forEach((meteor) => {
      const meteorRect = meteor.getBoundingClientRect();

      if (
        playerRect.left < meteorRect.right &&
        playerRect.right > meteorRect.left &&
        playerRect.top < meteorRect.bottom &&
        playerRect.bottom > meteorRect.top
      ) {
        // Collision with meteor detected
        isGameOver = true; // Set the flag to prevent further checks
  	  gameStarted = false;
  	  
  	  cancelAnimationFrame(animationId); // Stop the game loop
  	  clearTimeout(scoreTimeoutId);
  	  clearTimeout(kittyTimeoutId);
  	  
  	  document.querySelectorAll('.meteor').forEach(m => m.remove()); //Stop meteor spawning
  	  
  	  deathOverlay.style.display = 'flex'; // Show the ending overlay
      }
    });
}

function returnToStart() {
	// Switch overlays
	  deathOverlay.style.display = 'none';
	  startOverlay.style.display = 'flex';

	  // Reset variables
	  isGameOver = false;
	  gameStarted = false;
	  resetPlayer();
	  resetScore();

	  // Remove all kitties and meteors
	  document.querySelectorAll('.kitty').forEach(k => k.remove());
	  document.querySelectorAll('.meteor').forEach(m => m.remove());

	  // Clear timeouts and animations
	  cancelAnimationFrame(animationId);
	  clearTimeout(scoreTimeoutId);
	  clearTimeout(kittyTimeoutId);
	  clearTimeout(meteorTimeoutId); // Ensure meteor timeout is cleared
	  meteorTimeoutId = null;

	  gameWindow.style.animation = '';
}

function gameLoop() {
	console.log('Game loop running'); // Debugging log
	
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
	
	//Background movement
	backgroundPosition -= 2; 
	const groundWidth = 65;
	backgroundPosition = backgroundPosition % groundWidth;
	ground.style.backgroundPosition = `${backgroundPosition}px 0`;
	skyback.style.backgroundPosition = `${backgroundPosition / 2}px 0`;
	
	checkCollision(); // Check for collision in each frame

	animationId = requestAnimationFrame(gameLoop); // Save the animation frame ID
}

function showStartOverlay() {
    blackOverlay.style.display = 'none';
    startOverlay.style.display = 'flex';
    startOverlay.classList.add('visible');
    introVideo.style.display = 'none';
}

introVideo.addEventListener('ended', showStartOverlay);


//Listen for arrow up and spacebar key presses
document.addEventListener('keydown', function(event) {
	
	
	//Don't start game until user presses Insert Token button or spacebar
	if(event.key === " " && !gameStarted && !isGameOver) {
		startGame();
	 } else if(event.key === " " && isGameOver) {
	 	returnToStart();
	 }

	 if(!gameStarted) {
		return;
	 } 
	
	//Check that arrowup or spacebar was pressed and that max jumps is not surprassed 
	if((event.key === "ArrowUp" || event.key === " ") && jumpCount < maxJumps) {
		velocityY = jumpStrength;
		jumpCount++;
	}
	
	//Check that arrowdown was pressed
	if(event.key === "ArrowDown") {
		velocityY -= jumpStrength * 1;
		playerImg.style.transform = "scaleY(0.5)";
	}
	
});


//Listen for key releases
document.addEventListener('keyup', function(event) {
	//If game hasn't started, block crouching commands
	if(!gameStarted) {
		return;
	}
	
	//Check that arrowdown was released
	if(event.key === "ArrowDown") {
		playerImg.style.transform = "scaleY(1)";
	}
});


function startGame() {
	//Avoid double starting
	if(gameStarted) {
		return;
	}
	
	gameStarted = true;
	isGameOver = false;
	resetPlayer();
	resetScore();
	
	playerImg.style.visibility = "visible";
	
	// Flicker effect before starting
	gameWindow.style.animation = 'glow 0.1s infinite alternate';
	
	setTimeout(() => {
	    startOverlay.style.display = 'none';
	    gameWindow.style.animation = 'glow 2s infinite alternate';
	  }, 100); 
	  
	  //Restart game loop
	  cancelAnimationFrame(animationId);
	  animationId = requestAnimationFrame(gameLoop);
	  randomGlow();
	  updateScore(); // Start updating the score when the game starts
	  manageKitties(); // Start managing kitties
	  manageMeteors(); // Start managing meteors
}


//Listen for initial click to start game
startButton.addEventListener('click', () => {
	startOverlay.classList.remove('hidden');
	startOverlay.style.display = 'none';  
	blackOverlay.style.display = 'none';
	gameWindow.style.animationPlayState = "running";
	startGame();
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
    kittyTimeoutId = setTimeout(manageKitties, kittySpawnInterval);
  }
}

function randomGlow() {
  const intensity = Math.floor(Math.random() * 12);
  gameWindow.style.setProperty('--rand1', `${intensity}px`);
  setTimeout(randomGlow, Math.random() * 100);
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

retryButton.addEventListener('click', returnToStart);

window.addEventListener('load', () => {
	const bootOverlay = document.getElementById('bootScreenOverlay');
	  if (!bootOverlay) return;

	  gameWindow.classList.add('crtScanlines');

	  setTimeout(() => {
	    bootOverlay.remove();
	    gameWindow.classList.remove('crtScanlines');
	  }, 3000); 
});

playerImg.style.visibility = "hidden";
gameWindow.style.animationPlayState = "paused";
const introAudio = document.getElementById('introAudio');

enableSoundButton.addEventListener('click', () => {
    
    soundOverlay.style.display = 'none';
    blackOverlay.style.display = 'hidden'; 
	
    introVideo.style.display = 'block';
    introVideo.muted = false;
    introVideo.play();
	
	introAudio.loop = true;    // Ensure looping
	setTimeout(() => {
	        // Start looping audio at the same time as video would have been at that moment
	        introAudio.currentTime = introVideo.currentTime; // sync positions
	        introAudio.play();
	    }, 90000);   
    
    gameStarted = false;

    
    const fadeTime = 2000; 
    const introDuration = 5000; 

	setTimeout(() => {
	        introVideo.classList.add('fade-out');
	        blackOverlay.classList.add('hidden'); 

	        setTimeout(() => {
	        
	            startOverlay.style.display = 'flex';
	            startOverlay.classList.add('visible');

	            introVideo.style.display = 'none';
	        }, fadeTime);
	    }, introDuration);
});

introVideo.addEventListener('ended', () => {
	blackOverlay.classList.add('hidden'); 
	    startOverlay.style.display = 'flex';
	    startOverlay.classList.add('visible');
	    introVideo.style.display = 'none';
});



function spawnMeteor() {
  const newMeteor = document.createElement('img'); // Change from 'div' to 'img'
  newMeteor.src = 'assets/meteor.png'; // Use the meteor.png image
  newMeteor.classList.add('meteor'); // Add a class for styling
  newMeteor.style.position = 'absolute';
  newMeteor.style.right = '10%';
  newMeteor.style.bottom = '50px'; // Position right above the ground
  newMeteor.style.width = '30px';
  newMeteor.style.height = '30px';
  newMeteor.style.zIndex = '6';
  gameWindow.appendChild(newMeteor);

  // Move the meteor across the screen
  let meteorPosition = window.innerWidth + 10;
  function moveMeteor() {
    if (isGameOver) {
      newMeteor.remove(); // Remove meteor if the game is over
      return;
    }
    meteorPosition -= 3; // Adjust speed
    if (meteorPosition > -50) {
      newMeteor.style.left = `${meteorPosition}px`;
      requestAnimationFrame(moveMeteor);
    } else {
		newMeteor.remove(); // Remove meteor after it leaves the screen
	}
	}
	  moveMeteor();
	}
	
	function manageMeteors() {
		if (!isGameOver) {
		  spawnMeteor(); // Spawns a new meteor
		  if (score >= 200) {
			meteorSpawnInterval = 4000; // Adjust spawn interval after 200 points
		  }
		  console.log(`Next meteor in ${meteorSpawnInterval}ms`); // Debugging log
		  meteorTimeoutId = setTimeout(manageMeteors, meteorSpawnInterval); // Schedules the next meteor spawn
		}
	  }