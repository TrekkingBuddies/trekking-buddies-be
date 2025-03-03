const auth = require("../config/firebase");

const VerifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const decodedToken = await auth.verifyIdToken(token);
    if (decodedToken) {
      req.user = decodedToken;
      return next();
    }
  } catch (e) {
    return res.status(401).send({ msg: "Invalid token" });
  }
};

module.exports = VerifyToken;
