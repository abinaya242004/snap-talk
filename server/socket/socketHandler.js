const activeUsers = new Map();
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // USER JOINS (Global Connection)
    socket.on("userJoin", async (userData) => {
      const userId = userData.userId || userData.id;
      if (userId) {
        socket.join(userId.toString()); // Join a room named after the User ID
        activeUsers.set(socket.id, userData);
        
        // Update User status in DB
        try {
          await User.findByIdAndUpdate(userId, { isOnline: true });
        } catch (err) {
          console.error("Error updating user online status:", err);
        }

        io.emit("onlineUsers", Array.from(activeUsers.values()));
        console.log(`User ${userData.username} (${userId}) joined personal room`);
      }
    });

    // JOIN ROOM (Active Chat)
    socket.on("joinRoom", (roomId) => {
      if (roomId) {
        socket.join(roomId.toString());
        console.log(`User joined active chat room: ${roomId}`);
      }
    });

    // SEND MESSAGE
    socket.on("sendMessage", async (messageData) => {
      try {
        const roomId = messageData.chatRoom?._id || messageData.chatRoom;
        
        // 1. Broadcast to everyone currently IN the active chat window
        io.to(roomId.toString()).emit("receiveMessage", messageData);

        // 2. Also broadcast to all members of this chat room (for sidebar updates)
        const room = await ChatRoom.findById(roomId);
        
        if (room && room.users) {
          room.users.forEach(userId => {
            // Emit to each member's personal room
            io.to(userId.toString()).emit("receiveMessage", messageData);
          });
        }
      } catch (error) {
        console.error("Socket SendMessage Error:", error);
      }
    });

    // ROOM CREATED
    socket.on("createRoom", (roomData) => {
      if (roomData && roomData.users) {
        roomData.users.forEach(userObj => {
          const userId = userObj._id || userObj.id || userObj;
          io.to(userId.toString()).emit("newRoom", roomData);
        });
      }
    });

    // TYPING INDICATOR
    socket.on("typing", (data) => {
      const roomId = data.room || data.roomId;
      if (roomId) {
        socket.to(roomId.toString()).emit("userTyping", {
          username: data.username,
          isTyping: data.isTyping,
        });
      }
    });

    // STOP TYPING
    socket.on("stopTyping", (data) => {
      socket.to(data.roomId).emit("userTyping", {
        username: data.username,
        isTyping: false,
      });
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      const userData = activeUsers.get(socket.id);
      if (userData) {
        const userId = userData.userId || userData.id;
        try {
          await User.findByIdAndUpdate(userId, { 
            isOnline: false,
            lastSeen: new Date()
          });
        } catch (err) {
          console.error("Error updating user offline status:", err);
        }
      }

      activeUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(activeUsers.values()));
      console.log("User Disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;
