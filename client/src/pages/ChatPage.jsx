import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../socket/socket";
import {
  setRooms,
  setMessages,
  addMessage,
  setTypingUsers,
  setOnlineUsers,
  setActiveRoom as setActiveRoomRedux,
} from "../redux/slices/chatSlice";
import Sidebar from "../components/Sidebar";
import AppNavigation from "../components/AppNavigation";
import Header from "../components/Header";
import ChatBubble from "../components/ChatBubble";
import MessageInput from "../components/MessageInput";
import Loader from "../components/Loader";

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const { user, token } = useSelector((state) => state.auth);
  const { rooms, messages, typingUsers, onlineUsers } = useSelector(
    (state) => state.chat,
  );

  const [loading, setLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // Fetch rooms if not available (e.g., page refresh)
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchRooms = async () => {
      if (rooms.length === 0) {
        try {
          const response = await axios.get(
            "https://snap-talk-3-bl2l.onrender.com/api/chatrooms",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          dispatch(setRooms(response.data));
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchRooms();
  }, [token, navigate, rooms.length, dispatch]);

  // Set active room based on roomId from params
  useEffect(() => {
    if (rooms.length > 0) {
      const room = rooms.find((r) => r._id === roomId);
      if (room) {
        setActiveRoom(room);
        dispatch(setActiveRoomRedux(roomId));
      }
    }
  }, [rooms, roomId, dispatch]);

  // Load old messages
  useEffect(() => {
    if (!token || !roomId) return;

    setLoading(true);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://snap-talk-3-bl2l.onrender.com/api/messages/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(setMessages(response.data));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId, token, dispatch]);

  // Socket connection
  useEffect(() => {
    if (!user || !roomId) return;

    socket.emit("userJoin", { username: user.username, userId: user.id });
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("userTyping", (data) => {
      dispatch(setTypingUsers(data));
    });

    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("onlineUsers");
    };
  }, [roomId, user, dispatch]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    // Emit stop typing event
    socket.emit("typing", {
      room: roomId,
      isTyping: false,
      username: user.username,
    });

    try {
      const response = await axios.post(
        "https://snap-talk-3-bl2l.onrender.com/api/messages",
        {
          chatRoom: roomId,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      socket.emit("sendMessage", response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", {
      room: roomId,
      isTyping: true,
      username: user.username,
    });

    // Clear typing indicator after 2 seconds of no typing
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("typing", {
        room: roomId,
        isTyping: false,
        username: user.username,
      });
    }, 2000);
  };

  const handleJoinRoom = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-main)]">
      {/* App Navigation */}
      <AppNavigation />

      {/* Sidebar */}
      <Sidebar
        rooms={rooms}
        onJoinRoom={handleJoinRoom}
        activeRoomId={roomId}
      />

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col relative min-w-0 ${
          activeRoom?.isGroup ? "bg-[var(--bg-chat)]" : "bg-[var(--bg-chat)]"
        }`}
      >
        {/* Subtle Pattern for Groups Only */}
        {activeRoom?.isGroup && (
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(var(--text-main) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        )}

        {(() => {
          let displayName = activeRoom?.name;
          let displayAvatar = null;
          let isOnline = false;
          let lastSeen = null;

          if (activeRoom && !activeRoom.isGroup) {
            const otherUser = activeRoom.users?.find(
              (u) => u._id !== (user?.id || user?._id),
            );
            if (otherUser) {
              displayName = otherUser.username;
              displayAvatar = otherUser.avatar;
              isOnline = onlineUsers.some(
                (u) =>
                  (u.userId || u.id)?.toString() === otherUser._id?.toString(),
              );
              lastSeen = otherUser.lastSeen;
            } else if (displayName?.startsWith("private-")) {
              displayName = "Chat";
            }
          }

          return (
            <Header
              roomName={displayName}
              onlineUsersCount={onlineUsers.length}
              roomAvatar={displayAvatar}
              isGroup={activeRoom?.isGroup}
              isOnline={isOnline}
              lastSeen={lastSeen}
            />
          );
        })()}

        {/* Messages Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth flex flex-col bg-[var(--bg-chat)] relative z-0">
          {loading ? (
            <Loader />
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mb-4 rounded-full bg-[var(--bg-card)] flex items-center justify-center shadow-inner"
              >
                <span className="text-4xl text-[var(--primary-accent)]/80">
                  👋
                </span>
              </motion.div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">
                Say hello!
              </h3>
            </div>
          ) : (
            <div className="flex flex-col flex-1 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  const showDateDivider = false; // Logic to show date dividers can be added here
                  const isOwnMessage = msg.user._id === user?.id;

                  return (
                    <ChatBubble
                      key={msg._id || index}
                      message={msg}
                      isOwnMessage={isOwnMessage}
                      sender={msg.user}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2 text-[var(--text-muted)] text-sm italic mt-2 ml-14"
            >
              <span>
                {typingUsers.join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing
              </span>
              <div className="flex gap-1">
                <motion.div
                  className="w-1.5 h-1.5 bg-[var(--primary-accent)] rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-[var(--primary-accent)] rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: 0.1,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="w-1.5 h-1.5 bg-[var(--primary-accent)] rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: 0.2,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <MessageInput
          onSendMessage={handleSendMessage}
          isTyping={typingUsers.length > 0}
          onTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default ChatPage;
