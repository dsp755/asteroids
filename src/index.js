var score = 0;
let gameOver = false;
let gamePaused = false;
let spaceShip = document.getElementById("spaceShip");
const obstaclesArray = [];

const createObstacle = () => {
  if (!state.gamePaused) {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.top = `${Math.random() * window.innerHeight}px`;
    obstacle.style.left = window.innerWidth + "px";
    document.body.appendChild(obstacle);
    obstaclesArray.push(obstacle);

    state.score += 1;
    document.getElementById("score").innerText = `SCORE: ${state.score}`;
    document.getElementById("score").innerText = `SCORE: ${score}`;

    let obstaclePos = window.innerWidth;

    const moveObstacle = () => {
      if (!state.gamePaused) {
        obstaclePos -= 8;
        obstacle.style.transform = `translateX(${obstaclePos}px)`;

        if (obstacle.getBoundingClientRect().left <= 0) {
          obstacle.remove();
          obstaclesArray.shift();
          score += 1;
          return;
        }
      }
      requestAnimationFrame(moveObstacle);
    };

    requestAnimationFrame(moveObstacle);
  }
};

function moveWithMouse(event) {
  var x = event.clientX;
  var y = event.clientY;
  var margin = 20;

  // Check if the cursor is within the playing area with the margin
  if (
    x > margin &&
    y > margin &&
    x < window.innerWidth - margin &&
    y < window.innerHeight - margin
  ) {
    if (state.gamePaused) {
      state.gamePaused = false;
      start = setInterval(createObstacle, 40);
    }
    spaceShip.style.transform = `translate(${x}px, ${y}px)`;
  } else {
    if (!state.gamePaused) {
      state.gamePaused = true;
      clearInterval(start);
    }
  }
}

const checkCollision = () => {
  if (!state.gamePaused) {
    let circlePosition = checkPosition(spaceShip);
    obstaclesArray.forEach((el) => {
      if (
        circlePosition.left >= checkPosition(el).left - 20 &&
        circlePosition.left <= checkPosition(el).left + 20 &&
        circlePosition.right >= checkPosition(el).right - 20 &&
        circlePosition.right <= checkPosition(el).right + 20
      ) {
        document.body.innerHTML = `<div id='score' class='score'>SCORE: 
      ${state.score}</div><div class="game-over">GAME OVER<div id="restart" class="restart">RESTART</div></div>`;

        clearInterval(start);
        document.getElementById("restart").addEventListener("click", () => {
          restartGame(state);
          document.body.requestFullscreen();
        });
      }
    });
  }
};

document.addEventListener("mousemove", moveWithMouse);

function runOnEachFrame() {
  checkCollision();
  requestAnimationFrame(runOnEachFrame);
}

runOnEachFrame();

function checkPosition(elem) {
  return {
    left: Math.round(elem.getBoundingClientRect().left + 15),
    right: Math.round(elem.getBoundingClientRect().top + 15),
  };
}
