const Message = require("../models/Message");


// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { chatRoom, content } = req.body;

    // Validation
    if (!chatRoom || !content) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Create message
    const message = await Message.create({
      chatRoom,
      user: req.user._id,
      username: req.user.username,
      content,
    });

    // Update the room's updatedAt timestamp so it jumps to the top of the list
    const ChatRoom = require("../models/ChatRoom");
    await ChatRoom.findByIdAndUpdate(chatRoom, { 
      $set: { 
        updatedAt: Date.now(),
        lastMessage: message._id
      } 
    });

    // Populate user info
    const populatedMessage = await Message.findById(message._id)
      .populate("user", "username avatar")
      .populate("chatRoom", "name");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET ROOM MESSAGES
const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({
      chatRoom: roomId,
    })
      .populate("user", "username avatar")
      .populate("chatRoom", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  sendMessage,
  getMessages,
};