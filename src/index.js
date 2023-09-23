import { actions } from "./utils.js";

let spaceShip = document.getElementById("spaceShip");

document.addEventListener("mousemove", actions.moveSpaceShip);
document.addEventListener("keypress", actions.shoot);

actions.checkSpaceshipCollision(spaceShip);

setInterval(actions.createObstacle, 80);
