export const restartGame = (state) => {
  state.score = 0;
  document.body.innerHTML =
    "<div id='score' class='score'>SCORE: 0</div><div id='spaceShip' class='spaceShip' />";
  state.start = setInterval(createObstacle, 40);
  spaceShip = document.getElementById("spaceShip");

  // Get the center coordinates of the screen
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Set the spaceShip's transform property to center it on the screen
  spaceShip.style.transform = `translate(${centerX}px, ${centerY}px)`;
  moveWithKeyboard(spaceShip, 30);
};
