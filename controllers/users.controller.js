const {
  createUser,
  selectUserById,
  updateUserById,
  removeUserById,
  selectUsers,
} = require("../models/users.model");

exports.postUser = (req, res, next) => {
  const uid = req.user.uid; // from verifyUser
  const userData = req.body;

  if (!userData || Object.keys(userData).length === 0) {
    return res.status(400).send({ msg: "Bad Request" });
  }
  
  createUser(uid, userData)
    .then((user) => {
      res.status(201).send({ user: user.data() });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  selectUserById(req.params.userId)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUser = (req, res, next) => {
  const userData = req.body;

  if (!userData || Object.keys(userData).length === 0) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  updateUserById(req.params.userId, userData)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  removeUserById(req.params.userId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};
