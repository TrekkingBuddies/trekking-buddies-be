const { db } = require("../config/firebase");

exports.createUser = (userId, userData) => {
  return db
    .collection("users")
    .doc(userId)
    .set(userData)
    .then(() => {
      return db.collection("users").doc(userId).get();
    })
    .then((createdDoc) => {
      return createdDoc.data();
    });
};

exports.selectUserById = (userId) => {
  return db
    .collection("users")
    .doc(userId)
    .get()
    .then((user) => {
      if (user.exists) return user.data();
      else return Promise.reject({ status: 404, msg: `User not found` });
    });
};

exports.updateUserById = (userId, userData) => {
  return db
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return Promise.reject({ status: 404, msg: `User not found` });
      } else {
        return db
          .collection("users")
          .doc(userId)
          .update(userData)
          .then(() => {
            return db.collection("users").doc(userId).get();
          })
          .then((updatedDoc) => {
            return updatedDoc.data();
          });
      }
    });
};

exports.removeUserById = (userId) => {
  return db
    .collection("users")
    .doc(userId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return Promise.reject({ status: 404, msg: `User not found` });
      }
      return db.collection("users").doc(userId).delete();
    });
};

exports.selectUsers = () => {
  return db
    .collection("users")
    .get()
    .then((usersCollection) => {
      const users = [];
      usersCollection.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() });
      });
      return users;
    });
};
