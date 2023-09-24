import { state } from "./store.js";

let spaceShip = document.getElementById("spaceShip");

export const actions = {
  createSpaceShip() {
    spaceShip = document.createElement("div");
    spaceShip.classList.add("spaceShip");
    spaceShip.id = "spaceShip";

    document.body.innerHTML = `<div id='score' class='score'>SCORE: 
    0</div><div id='spaceShip' class='spaceShip' />`;

    spaceShip = document.getElementById("spaceShip");
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
      document.getElementById("score").innerText = `SCORE: ${state.score}`;
    } else if (obstacle.getBoundingClientRect().top) {
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

    actions.checkSpaceshipCollision(spaceShip);
  },

  endGame() {
    document.body.innerHTML = `
    <div id='score' class='score'>
      SCORE: ${state.score}
    </div>
    <div class="game-over">
      GAME OVER
      <div id="restart" class="restart">
        RESTART
      </div>
    </div>`;

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
        spaceShip.classList.add("destroyed");
        el.classList.add("destroyed");

        setTimeout(() => {
          spaceShip.remove();
          state.gameOver = true;
          actions.endGame();
        }, 1000);
      }
    });
  },

  checkSpaceshipCollision(object) {
    actions.checkCollision(object || spaceShip);

    if (!state.gameOver) {
      requestAnimationFrame(() =>
        actions.checkSpaceshipCollision(object || spaceShip)
      );
    }
  },

  checkBulletCollision(bullet) {
    const bulletPos = bullet.getBoundingClientRect();

    state.obstacles.forEach((el) => {
      const obstaclePos = el.getBoundingClientRect();

      if (
        bulletPos.right >= obstaclePos.left &&
        bulletPos.right <= obstaclePos.right &&
        bulletPos.top >= obstaclePos.top &&
        bulletPos.top <= obstaclePos.bottom
      ) {
        bullet.classList.add("destroyed");
        setTimeout(() => bullet.remove(), 200);

        el.classList.add("destroyed");
        setTimeout(() => el.remove(), 1000);

        state.score++;

        state.obstacles = state.obstacles.filter((item) => item !== el);
      }
    });

    if (!state.gameOver && bulletPos.right) {
      requestAnimationFrame(() => {
        actions.checkBulletCollision(bullet);
        actions.moveBullet(bullet, bulletPos.right);
      });
    }
  },

  shoot() {
    if (!state.gamePaused && !state.gameOver) {
      const circlePosition = actions.checkPosition(spaceShip);

      const bullet = actions.addBullet();

      bullet.style.left = `${circlePosition.left + 10}px`;
      bullet.style.top = `${circlePosition.right - 2}px`;

      document.body.appendChild(bullet);
      actions.checkBulletCollision(bullet);
    }
  },

  addBullet() {
    if (!state.gamePaused && !state.gameOver) {
      const bullet = document.createElement("div");
      bullet.classList.add("bullet");
      bullet.setAttribute("id", "bullet");

      return bullet;
    }
  },

  moveBullet(bullet, bulletPosition) {
    bulletPosition += 10;
    bullet.style.left = `${bulletPosition}px`;

    if (bulletPosition > window.innerWidth - 30) {
      bullet.remove();
    }
  },
};
