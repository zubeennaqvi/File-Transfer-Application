require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const File = require("./models/File");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://zubeen:zubeen%401234@cluster0.7smyt7e.mongodb.net/fileapp?retryWrites=true&w=majority&appName=Cluster0"
).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// JWT Middleware
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token required");

  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = decoded; // ✅ required: decoded must have .username
    next();
  });
}

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// In-Memory Store for Online Users
const onlineUsers = new Map();

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });
  res.json({ token });
});

// Upload route
app.post("/upload", authenticateToken, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  console.log(`User ${req.user.username} uploaded ${req.file.originalname}`);
  res.json({ message: "File uploaded successfully" });
});

// File history
app.get("/history", authenticateToken, async (req, res) => {
  const username = req.user.username;
  console.log("📜 Fetching history for:", username); // <-- Add this
  try {
    const sent = await File.find({ sender: username }).sort({ timestamp: -1 });
    const received = await File.find({ recipient: username }).sort({ timestamp: -1 });
    res.json({ sent, received });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});


// Socket.IO Auth Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Token required"));

  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, decoded) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = decoded;
    next();
  });
});

// Real-time File Transfer
io.on("connection", (socket) => {
  const username = socket.user.username;
  console.log(`✅ ${username} connected`);

  // Track user online
  onlineUsers.set(username, socket.id);
  io.emit("online_users", Array.from(onlineUsers.keys()));

  socket.on("file_upload", async (fileData) => {
    const { name, size, type, recipient, fileBuffer } = fileData;
    console.log(`📤 ${username} is sending "${name}" to ${recipient}`);

    // Save file metadata to MongoDB
    try {
      await File.create({
        name,
        size,
        type,
        sender: username,
        recipient,
        timestamp: new Date(), // ✅ needed for sorting in /history
      });
    } catch (err) {
      console.error("❌ MongoDB file save error:", err);
    }

    const targetSocketId = onlineUsers.get(recipient);
    if (targetSocketId) {
      io.to(targetSocketId).emit("file_received", {
        name,
        size,
        type,
        sender: username,
        fileBuffer, // ✅ send correctly named buffer
      });
    } else {
      socket.emit("error", `❌ User "${recipient}" is not online`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ ${username} disconnected`);
    onlineUsers.delete(username);
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
