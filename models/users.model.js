const { db } = require("../config/firebase");
const geofire = require("geofire-common");
const {
  geohashForLocation,
  geohashQueryBounds,
  distanceBetween,
} = require("geofire-common");

exports.createUser = (userId, userData) => {
  const hash = geofire.geohashForLocation([
    Number(userData.latLong.latitude),
    Number(userData.latLong.longitude),
  ]);
  return db
    .collection("users")
    .doc(userId)
    .set({ ...userData, geohash: hash })
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

exports.selectUsers = (
  skill_level,
  preferences,
  limit,
  p,
  distance = 10000,
  uid
) => {
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

  return this.selectUserById(uid).then((user) => {
    const center = [
      Number(user.latLong.latitude),
      Number(user.latLong.longitude),
    ];
    const bounds = geohashQueryBounds(center, Number(distance) * 1000);
    const promises = [];

    for (const b of bounds) {
      const q = db
        .collection("users")
        .where("geohash", ">=", b[0])
        .where("geohash", "<=", b[1])
        .get();
      promises.push(q);
    }

    return Promise.all(promises).then((snapshots) => {
      let users = [];
      for (const snap of snapshots) {
        snap.forEach((doc) => {
          users.push({ uid: doc.id, ...doc.data() });
        });
      }

      users = users
        .filter((user) => {
          const userLat = Number(user.latLong.latitude);
          const userLng = Number(user.latLong.longitude);
          if (!userLat || !userLng) return false;
          const userDistance =
            distanceBetween([userLat, userLng], center) * 1000;
          return userDistance <= Number(distance) * 1000 && user.uid !== uid;
        })
        .map((user) => {
          const userLat = Number(user.latLong.latitude);
          const userLng = Number(user.latLong.longitude);
          const userDistance = distanceBetween([userLat, userLng], center);
          return { ...user, distance: Math.round(userDistance) };
        })
        .sort((a, b) => a.distance - b.distance);

      if (preferences && preferences.length > 0) {
        users = users.filter((user) =>
          preferences.every((pref) => user.preferences.includes(pref))
        );
      }

      if (limit && p) {
        const startAt = (p - 1) * limit;
        users = users.slice(startAt, startAt + limit);
      }

      let query = db.collection("users");
      if (skill_level) {
        query = query.where("skill_level", "==", skill_level);
      }

      if (preferences && preferences.length > 0) {
        query = query.where("preferences", "array-contains-any", preferences);
      }
      return { users };
    });
  });
};
