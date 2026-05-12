import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rooms: [],
  activeRoom: null,
  activeTab: "all_chats",
  messages: [],
  onlineUsers: [],
  typingUsers: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {

    setRooms: (state, action) => {
      state.rooms = action.payload;
    },

    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload;
      // Clear unread count for the room we just opened
      const room = state.rooms.find(r => r._id === action.payload);
      if (room) {
        room.unreadCount = 0;
      }
    },

    setSidebarTab: (state, action) => {
      state.activeTab = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      const message = action.payload;

      // Prevent duplicates
      if (state.messages.some((m) => m._id === message._id)) return;

      // Robust ID Extraction
      const messageRoomId = (message.chatRoom?._id || message.chatRoom).toString();
      const activeRoomId = state.activeRoom?.toString();
      
      // 1. Update Messages List
      if (activeRoomId === messageRoomId) {
        state.messages.push(message);
      }
      
      // 2. Update Room in Sidebar
      const roomIndex = state.rooms.findIndex(r => r._id.toString() === messageRoomId);
      
      if (roomIndex > -1) {
        // Clone the room to ensure Redux/Immer detects a change
        const room = { ...state.rooms[roomIndex] };
        state.rooms.splice(roomIndex, 1);
        
        // Logic for "Pink" status (Unread)
        if (activeRoomId !== messageRoomId) {
           room.unreadCount = (room.unreadCount || 0) + 1;
        } else {
           room.unreadCount = 0;
        }

        room.lastMessage = message;
        room.updatedAt = message.createdAt;

        // Move to top
        state.rooms.unshift(room);
      }
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setTypingUsers: (state, action) => {
      const { username, isTyping } = action.payload;
      if (isTyping) {
        if (!state.typingUsers.includes(username)) {
          state.typingUsers.push(username);
        }
      } else {
        state.typingUsers = state.typingUsers.filter(u => u !== username);
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    updateRoom: (state, action) => {
      const updatedRoom = action.payload;
      const index = state.rooms.findIndex(r => r._id.toString() === updatedRoom._id.toString());
      if (index !== -1) {
        state.rooms[index] = updatedRoom;
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setRooms,
  setActiveRoom,
  setSidebarTab,
  setMessages,
  addMessage,
  setOnlineUsers,
  setTypingUsers,
  setLoading,
  setError,
  updateRoom,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;