const express = require("express");
const cors = require("cors"); //allow frontend request
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");

const protect = require("./middleware/authMiddleware");
const socketHandler = require("./socket/socketHandler");

dotenv.config();


connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/chatrooms", roomRoutes);
app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});

// Protected Test Route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// SOCKET.IO LOGIC (Modularized)
socketHandler(io);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});