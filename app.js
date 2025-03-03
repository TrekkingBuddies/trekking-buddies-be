const express = require("express");
const app = express();
const apiRoutes = require("./routes/api-router");
const cors = require("cors");
const VerifyToken = require("./middlewares/verifyToken");
const usersRoutes = require("./routes/users-router");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

app.use("/api", apiRoutes);
app.use("/api/users", usersRoutes);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, " <-- This error is not handled yet");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
