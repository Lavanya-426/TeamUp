const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/teamup")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("hello");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const requestRoutes = require("./routes/requestRoutes");
app.use("/api/requests", requestRoutes);

const teamRoutes = require("./routes/teamRoutes");
app.use("/api/teams", teamRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const discoveryRoutes = require("./routes/teamDiscoveryRoutes");
app.use("/api/discover", discoveryRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
