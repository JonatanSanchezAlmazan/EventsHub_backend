const eventsRouter = require("./event");
const usersRouter = require("./user");

const mainRouter = require("express").Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/events", eventsRouter);

module.exports = mainRouter;
