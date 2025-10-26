const playerImg = document.querySelector('#playerImg');
const gameWindow = document.querySelector('.gameWindow');
const startButton = document.getElementById('startButton');
const startOverlay = document.getElementById('startOverlay');

let jumpCount = 0;
let playerBottom = 0;
let velocityY = 0; 
let originalHeight = playerImg.height;      
const jumpStrength = 10; 
const gravity = 0.3;     
const maxJumps = 2;
const ceiling = gameWindow.offsetHeight - playerImg.offsetHeight;


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
	
	requestAnimationFrame(gameLoop);
	
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
});
const ground = document.getElementById('ground');

// Initialize the background position
let backgroundPosition = 0;

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


