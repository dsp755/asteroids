import { actions } from "./utils.js";

let spaceShip = document.getElementById("spaceShip");

document.addEventListener("mousemove", actions.moveSpaceShip);

actions.runCollisionCheck(spaceShip);

setInterval(actions.createObstacle, 100);
