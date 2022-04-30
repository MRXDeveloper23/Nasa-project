const planetsRouter = require("express").Router();
const { getPlanets } = require("./planets.controller");

planetsRouter.get("/", getPlanets);

module.exports = planetsRouter;
