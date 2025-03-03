const { postUser} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").post(postUser);

usersRouter.route("/:userId");

module.exports = usersRouter;
