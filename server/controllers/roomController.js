const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");

// CREATE ROOM (Group)
const createRoom = async (req, res) => {
  try {
    const { name, users } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }

    //default ah namba illana add pannum
    const roomUsers = users || [req.user._id];
    if (!roomUsers.includes(req.user._id)) roomUsers.push(req.user._id);

    const room = await ChatRoom.create({
      name,
      isGroup: true,
      users: roomUsers,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Group created successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE PRIVATE CHAT (1-on-1)
const createPrivateChat = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user._id;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    // Check if a private chat already exists
    let room = await ChatRoom.findOne({
      isGroup: false,
      users: { $all: [senderId, recipientId], $size: 2 }
    }).populate("users", "username avatar isOnline lastSeen");

    if (room) {
      return res.status(200).json({ message: "Chat already exists", room });
    }

    // Create new private chat with a unique internal name to avoid DB unique index issues
    const internalName = `private-${[senderId, recipientId].sort().join("-")}`;
    
    room = await ChatRoom.create({
      name: internalName,
      isGroup: false,
      users: [senderId, recipientId],
      createdBy: senderId,
    });

    const populatedRoom = await ChatRoom.findById(room._id).populate("users", "username avatar isOnline lastSeen");

    res.status(201).json({ message: "Private chat created", room: populatedRoom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL USERS (To start new chats)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("username avatar isOnline lastSeen");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ROOMS
const getRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ users: req.user._id })
      .populate("createdBy", "username")
      .populate("users", "username avatar isOnline lastSeen")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// TOGGLE ARCHIVE
const toggleArchive = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await ChatRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const isArchived = room.archivedBy.includes(userId);

    if (isArchived) {
      room.archivedBy = room.archivedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      room.archivedBy.push(userId);
    }

    await room.save();

    const populatedRoom = await ChatRoom.findById(room._id)
      .populate("users", "username avatar isOnline lastSeen")
      .populate("lastMessage");

    res.status(200).json({
      message: isArchived ? "Room unarchived" : "Room archived",
      room: populatedRoom,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getRooms,
  toggleArchive,
  getUsers,
  createPrivateChat,
};