const db = require("../config/firebase");

exports.createUser = (userId, userData) => {
  return db.collection("users").doc(userId).set(userData);
};

exports.getUserById = (userId) => {
  return db.collection("users").doc(userId).get();
};
