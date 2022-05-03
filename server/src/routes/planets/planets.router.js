const planetsRouter = require("express").Router();
const { httpGetPlanets } = require("./planets.controller");

planetsRouter.get("/", httpGetPlanets);

module.exports = planetsRouter;
