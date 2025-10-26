document.addEventListener('DOMContentLoaded', () => {
    // Select the ground, kitty, and start button elements
    const ground = document.getElementById('ground');
    const kitty = document.getElementById('kittyImg');
    const startButton = document.getElementById('startButton');

    // Check if the elements exist
    if (!ground || !kitty || !startButton) {
        console.error('Ground, Kitty, or Start Button element not found!');
        return;
    }

    // Initialize positions
    let backgroundPosition = 0;
    let kittyPosition = window.innerWidth + 10; // Start kitty on the far right

    // Function to animate the ground and kitty
    function animateScene() {
        // Move the ground
        backgroundPosition -= 2; // Adjust speed by changing this value
        ground.style.backgroundPosition = `${backgroundPosition}px 0`;

        // Move the kitty toward the player
        kittyPosition -= 2; // Same speed as the ground
        if (kittyPosition > -50) { // Stop when kitty reaches the player
            kitty.style.left = `${kittyPosition}px`;
        }

        // Keep the animation running
        requestAnimationFrame(animateScene);
    }

    // Add click event listener to the start button
    startButton.addEventListener('click', () => {
        // Start the animation when the button is clicked
        animateScene();
    });
});