document.addEventListener('DOMContentLoaded', () => {
    // Select the ground, skyback, kitty, and start button elements
    const ground = document.getElementById('ground');
    const skyback = document.getElementById('skyback'); // Select the skyback
    const kitty = document.getElementById('kittyImg');
    const startButton = document.getElementById('startButton');

    // Check if the elements exist
    if (!ground || !skyback || !kitty || !startButton) {
        console.error('Ground, Skyback, Kitty, or Start Button element not found!');
        return;
    }

    // Initialize positions
    let backgroundPosition = 0;
    let kittyPosition = window.innerWidth + 10; // Start kitty on the far right
    let animationId; // Variable to store the animation frame ID
    let isGameOver = false; // Flag to prevent multiple collision triggers

    function resetGroundAndKitty() {
        backgroundPosition = 0;
        kittyPosition = window.innerWidth + 10;
        ground.style.backgroundPosition = `${backgroundPosition}px 0`;
        skyback.style.backgroundPosition = `${backgroundPosition}px 0`; // Reset skyback position
        kitty.style.left = `${kittyPosition}px`;
    }

    function restartScene() {
        resetGroundAndKitty();
        document.getElementById('startOverlay').style.display = 'none';
        animationId = requestAnimationFrame(animateScene); // Restart the animation
    }

    // Function to animate the ground, skyback, and kitty
    function animateScene() {
        if (isGameOver) return; // Skip animation if the game is over

        // Move the ground and skyback
        backgroundPosition -= 2; // Adjust speed by changing this value
        ground.style.backgroundPosition = `${backgroundPosition}px 0`;
        skyback.style.backgroundPosition = `${backgroundPosition}px 0`; // Move skyback

        // Move the kitty toward the player
        kittyPosition -= 2; // Same speed as the ground
        if (kittyPosition > -50) { // Stop when kitty reaches the player
            kitty.style.left = `${kittyPosition}px`;
        } else {
            // Reappear the kitty on the right side after it goes off the left edge
            kittyPosition = window.innerWidth + 10;
            kitty.style.left = `${kittyPosition}px`;
        }

        // Check for collision
        const playerRect = document.querySelector('#playerImg').getBoundingClientRect();
        const kittyRect = kitty.getBoundingClientRect();

        if (
            playerRect.left < kittyRect.right &&
            playerRect.right > kittyRect.left &&
            playerRect.top < kittyRect.bottom &&
            playerRect.bottom > kittyRect.top
        ) {
            isGameOver = true; // Set the flag to prevent further checks
            cancelAnimationFrame(animationId); // Stop the animation
            document.getElementById('startOverlay').style.display = 'flex'; // Show the start overlay
            setTimeout(() => {
                isGameOver = false; // Reset the flag
                restartScene();
            }, 2000); // Restart the game after a delay
            return; // Exit the function
        }

        // Keep the animation running
        animationId = requestAnimationFrame(animateScene); // Save the animation frame ID
    }

    // Add click event listener to the start button
    startButton.addEventListener('click', () => {
        // Start the animation when the button is clicked
        animateScene();
    });
});