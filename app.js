const express = require("express");
const app = express();
const apiRoutes = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRoutes);

module.exports = app;