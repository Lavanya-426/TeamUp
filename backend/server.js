const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
