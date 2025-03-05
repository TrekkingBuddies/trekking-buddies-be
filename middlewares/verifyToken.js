const { auth } = require("../config/firebase");

const VerifyToken = async (req, res, next) => {
  if (req.url === "/favicon.ico") {
    return next();
  }

  const token = req.headers.authorization;
  console.log(token)

  if (!token) {
    return res.status(401).send({ msg: "No token provided" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    if (decodedToken) {
      req.user = decodedToken;
      return next();
    } else {
      return res.status(401).send({ msg: "Invalid token no token" });
    }
  } catch (e) {
    console.error("Token verification error:", e);
    return res.status(401).send({ msg: "Invalid token" });
  }
};

module.exports = VerifyToken;
