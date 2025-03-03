const {
  postUser,
  getUsers,
  getUserById,
  patchUser,
  deleteUser,
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter
  .route("/:userId")
  .get(getUserById)
  .post(postUser)
  .patch(patchUser)
  .delete(deleteUser);

module.exports = usersRouter;
