const admin = require("firebase-admin");
const serviceAccountKey = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
