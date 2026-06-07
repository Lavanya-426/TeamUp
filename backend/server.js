// Import required modules
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");

// Create Express app
const app = express();

// Middleware
const cors = require("cors");

const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());

// Connect to Database
connectDB();

// Basic route to test server
app.get("/", (req, res) => {
  res.send("server started");
});

const apiLimiter = require("./middleware/rateLimiter");
const authLimiter = require("./middleware/rateLimiter");
app.use("/api/auth", authLimiter);

app.use("/api", apiLimiter);

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
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Import and initialize socket logic
const socket = require("./sockets/index");
socket(io);
const jwt = require("jsonwebtoken");

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

const PORT = process.env.PORT;
// Start server
server.listen(PORT, () => {
  console.log("Server running");
});
