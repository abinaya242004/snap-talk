const express = require("express");

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Send Message
router.post("/", protect, sendMessage);


// Get Messages by Room
router.get("/:roomId", protect, getMessages);


module.exports = router;