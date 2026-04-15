const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const requestRoutes = require("./routes/reuestRoutes");
app.use("/api/request", requestRoutes);

const teamRoutes = require("./routes/teamRoutes");
app.use("/api/team", teamRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const discoveryRoutes = require("./routes/teamDiscoveryRoutes");

app.use("/api/discover", discoveryRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
