// Import required modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const cors = require("cors");
const connectDB = require("./config/db");

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// Connect to Database
connectDB();

// Basic route to test server
app.get("/", (req, res) => {
  res.send("Hello");
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/discover", require("./routes/teamDiscoveryRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
// Create HTTP server using Express app
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Import and initialize socket logic
const socket = require("./sockets/index");
socket(io);

// Start server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
