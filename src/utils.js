import { state } from "./store.js";

let spaceShip = document.getElementById("spaceShip");

export const actions = {
  createSpaceShip() {
    spaceShip = document.createElement("div");
    spaceShip.classList.add("spaceShip");
    spaceShip.id = "spaceShip";

    document.body.innerHTML =
      "<div id='score' class='score'>SCORE: 0</div><div id='spaceShip' class='spaceShip' />";

    spaceShip = document.getElementById("spaceShip");
  },

  createObstacle() {
    if (!state.gamePaused && !state.gameOver) {
      const obstacle = document.createElement("div");
      obstacle.classList.add("obstacle");
      obstacle.style.top = `${Math.random() * window.innerHeight}px`;
      obstacle.style.right = `0px`;
      document.body.appendChild(obstacle);
      state.obstacles.push(obstacle);

      actions.moveObstacle(obstacle, window.innerWidth - 30);
    }
  },

  moveObstacle(obstacle, obstaclePos) {
    if (state.gameOver) {
      return;
    }

    if (!state.gamePaused) {
      obstaclePos -= 8;
      obstacle.style.left = `${obstaclePos}px`;
    }

    if (obstacle.getBoundingClientRect().right <= 30) {
      obstacle.remove();
      state.obstacles = state.obstacles.filter((item) => item !== obstacle);
      state.score++;
      document.getElementById("score").innerText = `SCORE: ${state.score}`;
    } else {
      requestAnimationFrame(() => actions.moveObstacle(obstacle, obstaclePos));
    }
  },

  pauseGame() {
    state.gamePaused = true;
  },

  resumeGame() {
    state.gamePaused = false;
    state.gameOver = false;
  },

  restartGame() {
    actions.createSpaceShip();

    spaceShip = document.getElementById("spaceShip");

    actions.resumeGame();

    state.score = 0;
    state.obstacles = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    spaceShip.style.transform = `translate(${centerX}px, ${centerY}px)`;

    document.addEventListener("mousemove", actions.moveSpaceShip);

    actions.runCollisionCheck(spaceShip);
  },

  moveSpaceShip(e) {
    function move(event, spaceShip) {
      const x = event.clientX;
      const y = event.clientY;
      const margin = 20;

      if (
        x > margin &&
        y > margin &&
        x < window.innerWidth - margin &&
        y < window.innerHeight - margin
      ) {
        state.gamePaused = false;
        spaceShip.style.transform = `translate(${x}px, ${y}px)`;
      } else {
        state.gamePaused = true;
      }
    }

    move(e, spaceShip);
  },

  endGame() {
    document.body.innerHTML = `<div id='score' class='score'>SCORE: 
    ${state.score}</div><div class="game-over">GAME OVER<div id="restart" class="restart">RESTART</div></div>`;

    document.removeEventListener("mousemove", actions.moveSpaceShip);

    state.obstacles = [];

    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", actions.restartGame);
  },

  checkPosition(el) {
    return {
      left: Math.round(el.getBoundingClientRect().left + 15),
      right: Math.round(el.getBoundingClientRect().top + 15),
    };
  },

  checkCollision(spaceShip) {
    const circlePosition = actions.checkPosition(spaceShip);

    state.obstacles.forEach((el) => {
      if (
        circlePosition.left >= actions.checkPosition(el).left - 20 &&
        circlePosition.left <= actions.checkPosition(el).left + 20 &&
        circlePosition.right >= actions.checkPosition(el).right - 20 &&
        circlePosition.right <= actions.checkPosition(el).right + 20
      ) {
        state.gameOver = true;
        actions.endGame();
      }
    });
  },

  runCollisionCheck(spaceShip) {
    actions.checkCollision(spaceShip);
    requestAnimationFrame(() => actions.runCollisionCheck(spaceShip));
  },
};
