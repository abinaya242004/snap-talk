const express = require("express");

const {
  createRoom,
  getRooms,
  toggleArchive,
  getUsers,
  createPrivateChat,
} = require("../controllers/roomController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createRoom);


router.post("/private", protect, createPrivateChat);

// Get All Users (for starting chats)
router.get("/users", protect, getUsers);

// Get All Rooms for the current user
router.get("/", protect, getRooms);

// Toggle Archive
router.put("/:roomId/archive", protect, toggleArchive);

module.exports = router;