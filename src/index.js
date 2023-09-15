let score = 0;
let gameOver = false;
let gamePaused = false;
let spaceShip = document.getElementById("spaceShip");
let obstaclesArray = [];
document.body.style.cursor = "none"; // Hide the cursor

const restartGame = () => {
  gameOver = false;
  gamePaused = false;
  score = 0;
  document.body.innerHTML =
    "<div id='score' class='score'>SCORE: 0</div><div id='spaceShip' class='spaceShip' />";
  spaceShip = document.getElementById("spaceShip");

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  spaceShip.style.transform = `translate(${centerX}px, ${centerY}px)`;
};

const createObstacle = () => {
  if (!gamePaused && !gameOver) {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.top = `${Math.random() * window.innerHeight}px`;
    obstacle.style.right = `0px`;
    document.body.appendChild(obstacle);
    obstaclesArray.push(obstacle);

    moveObstacle(obstacle, window.innerWidth - 30);
  }
};

const moveObstacle = (obstacle, obstaclePos) => {
  if (gameOver) {
    return;
  }

  if (!gamePaused) {
    obstaclePos -= 8;
    obstacle.style.left = `${obstaclePos}px`;
  }

  if (obstacle.getBoundingClientRect().right <= 30) {
    obstacle.remove();
    obstaclesArray = obstaclesArray.filter((item) => item !== obstacle);
    score++;
    document.getElementById("score").innerText = `SCORE: ${score}`;
  } else {
    requestAnimationFrame(() => moveObstacle(obstacle, obstaclePos));
  }
};

const checkCollision = () => {
  const circlePosition = checkPosition(spaceShip);
  obstaclesArray.forEach((el) => {
    if (
      circlePosition.left >= checkPosition(el).left - 20 &&
      circlePosition.left <= checkPosition(el).left + 20 &&
      circlePosition.right >= checkPosition(el).right - 20 &&
      circlePosition.right <= checkPosition(el).right + 20
    ) {
      gameOver = true;
      document.body.innerHTML = `<div id='score' class='score'>SCORE: 
      ${score}</div><div class="game-over">GAME OVER<div id="restart" class="restart">RESTART</div></div>`;
      obstaclesArray = [];
      const restartButton = document.getElementById("restart");
      restartButton.addEventListener("click", restartGame);
    }
  });
};

document.addEventListener("mousemove", (event) => {
  const x = event.clientX;
  const y = event.clientY;
  const margin = 20;

  if (
    x > margin &&
    y > margin &&
    x < window.innerWidth - margin &&
    y < window.innerHeight - margin
  ) {
    gamePaused = false;
    spaceShip.style.transform = `translate(${x}px, ${y}px)`;
  } else {
    gamePaused = true;
    document.body.style.cursor = "default"; // Show the cursor
  }
});

const runCollisionCheck = () => {
  checkCollision();
  requestAnimationFrame(runCollisionCheck);
};

runCollisionCheck();

function checkPosition(elem) {
  return {
    left: Math.round(elem.getBoundingClientRect().left + 15),
    right: Math.round(elem.getBoundingClientRect().top + 15),
  };
}

setInterval(createObstacle, 100);
