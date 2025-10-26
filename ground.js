document.addEventListener('DOMContentLoaded', () => {
  const ground = document.getElementById('ground');
  const skyback = document.getElementById('skyback');
  const kitty = document.getElementById('kittyImg');
  const startButton = document.getElementById('startButton');
  if (!ground || !skyback || !kitty || !startButton) {
    console.error('Ground, Skyback, Kitty, or Start Button element not found!');
    return;
  }
  let backgroundPosition = 0;
  let kittyPosition = window.innerWidth + 10;
  let animationId;
  let isGameOver = false;
  function resetGroundAndKitty() {
    backgroundPosition = 0;
    kittyPosition = window.innerWidth + 10;
    ground.style.backgroundPosition = `${backgroundPosition}px 0`;
    skyback.style.backgroundPosition = `${backgroundPosition}px 0`;
    kitty.style.left = `${kittyPosition}px`;
  }
  function restartScene() {
    resetGroundAndKitty();
    document.getElementById('startOverlay').style.display = 'none';
    animationId = requestAnimationFrame(animateScene);
  }
  function animateScene() {
    if (isGameOver) return;
    backgroundPosition -= 2;
    ground.style.backgroundPosition = `${backgroundPosition}px 0`;
    skyback.style.backgroundPosition = `${backgroundPosition}px 0`;
    kittyPosition -= 2;
    if (kittyPosition > -50) {
      kitty.style.left = `${kittyPosition}px`;
    } else {
      kittyPosition = window.innerWidth + 10;
      kitty.style.left = `${kittyPosition}px`;
    }
    const playerRect = document.querySelector('#playerImg').getBoundingClientRect();
    const kittyRect = kitty.getBoundingClientRect();
    if (
      playerRect.left < kittyRect.right &&
      playerRect.right > kittyRect.left &&
      playerRect.top < kittyRect.bottom &&
      playerRect.bottom > kittyRect.top
    ) {
      isGameOver = true;
      cancelAnimationFrame(animationId);
      document.getElementById('startOverlay').style.display = 'flex';
      setTimeout(() => {
        isGameOver = false;
        restartScene();
      }, 2000);
      return;
    }
    animationId = requestAnimationFrame(animateScene);
  }
  startButton.addEventListener('click', () => {
    animateScene();
  });
});
