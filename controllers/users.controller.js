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
      res.status(201).send({ user: user });
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
  const tokenUid = req.user.uid; // from verifyUser
  const requestUid = req.params.userId;

  if (requestUid !== tokenUid) {
    //  if user tries to patch their own info
    return res.status(403).send({ msg: "Forbidden" });
  }

  const userData = req.body;

  if (!userData || Object.keys(userData).length === 0) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  updateUserById(requestUid, userData)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const tokenUid = req.user.uid; // from verifyUser
  const requestUid = req.params.userId;

  if (requestUid !== tokenUid) {
    //  if user tries to delete their own info
    return res.status(403).send({ msg: "Forbidden" });
  }

  removeUserById(req.params.userId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  const { skill_level, preferences, limit, p, distance } = req.query;
  const tokenUid = req.user.uid;

  let requestedPreferences = preferences ? preferences.split(",") : null;

  const parsedLimit = limit ? parseInt(limit, 10) : null;
  const parsedPage = p ? parseInt(p, 10) : null;

  selectUsers(skill_level, requestedPreferences, parsedLimit, parsedPage, distance, tokenUid)
    .then((usersData) => {
      res.status(200).send(usersData);
    })
    .catch((err) => {
      next(err);
    });
};
