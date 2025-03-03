const {
  createUser,
  selectUserById,
  updateUserById,
  removeUserById,
  selectUsers,
} = require("../models/users.model");

exports.postUser = (req, res, next) => {
  const uid = req.user.uid; // from verifyUser
  createUser(uid, req.body)
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
  updateUserById(req.params.userId, req.body)
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
