const createUser = require("../models/users.model");

exports.postUser = (req, res, next) => {
  createUser(req.params.userId, req.body)
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
      res.status(200).send({ user: user.data() });
    })
    .catch((err) => {
      next(err);
    });
};
