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

exports.selectUsers = (skill_level, preferences, limit, p) => {
  const validSkillLevel = ["novice", "intermediate", "pro"];
  const validPreferences = ["uphill", "flat", "countryside", "dog friendly"];

  if (skill_level && !validSkillLevel.includes(skill_level.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: `Invalid skill_level parameter: ${skill_level}`,
    });
  }

  if (preferences) {
    for (const preference of preferences) {
      if (!validPreferences.includes(preference.toLowerCase())) {
        return Promise.reject({
          status: 400,
          msg: `Invalid preference parameter: ${preference}`,
        });
      }
    }
  }

  if ((limit && !p) || (!limit && p)) {
    return Promise.reject({
      status: 400,
      msg: "Both limit and page parameters are required for pagination",
    });
  }

  let query = db.collection("users");

  if (skill_level) {
    query = query.where("skill_level", "==", skill_level);
  }

  if (preferences && preferences.length > 0) {
    query = query.where("preferences", "array-contains-any", preferences);
  }

  let totalCountQuery = query; // save a copy for total count

  if (limit && p) {
    const startAt = (p - 1) * limit;
    query = query.limit(limit).offset(startAt);
  }

  return query.get().then((usersCollection) => {
    let users = [];
    usersCollection.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });

    // filter users on backend who have all requested preferences as Firestore does not support multiple filters
    if (preferences && preferences.length > 0) {
      users = users.filter((user) =>
        preferences.every((pref) => user.preferences.includes(pref))
      );
    }

    if (limit && p) {
      return totalCountQuery.get().then((totalCountSnapshot) => {
        const total_count = totalCountSnapshot.size;
        return { users, total_count };
      });
    } else {
      return { users };
    }
  });
};
