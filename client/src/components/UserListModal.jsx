import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch, FiUserPlus } from "react-icons/fi";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setRooms } from "../redux/slices/chatSlice";
import Avatar from "./Avatar";

const UserListModal = ({ isOpen, onClose, onChatStarted }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("https://snap-talk-3-bl2l.onrender.com/api/chatrooms/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(response.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen, token]);

  const startPrivateChat = async (recipientId) => {
    try {
      const response = await axios.post(
        "https://snap-talk-3-bl2l.onrender.com/api/chatrooms/private",
        { recipientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update rooms list in redux to include the new/existing private chat
      const roomsResponse = await axios.get("https://snap-talk-3-bl2l.onrender.com/api/chatrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setRooms(roomsResponse.data));
      
      onChatStarted(response.data.room._id);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[var(--bg-main)] rounded-[32px] shadow-2xl overflow-hidden border border-[var(--border-color)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--text-main)]">New Chat</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] text-[var(--text-muted)] transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto px-2 pb-6 custom-scrollbar">
              {loading ? (
                <div className="text-center py-10 text-[var(--text-muted)] text-sm">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-[var(--bg-card)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    👥
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">No users found</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    You are currently the only user! Open an <b>incognito tab</b> and register another account to start a private chat.
                  </p>
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isOnline = onlineUsers.some(onlineUser => (onlineUser.userId || onlineUser.id)?.toString() === u._id?.toString());
                  
                  return (
                    <button
                      key={u._id}
                      onClick={() => startPrivateChat(u._id)}
                      className="w-full flex items-center p-3 rounded-2xl hover:bg-[var(--bg-card)] transition-all text-left group"
                    >
                      <Avatar
                        src={u.avatar}
                        alt={u.username}
                        size="lg"
                        initials={u.username.substring(0, 2).toUpperCase()}
                        status={isOnline ? "online" : "offline"}
                      />
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-[var(--text-main)] group-hover:text-[var(--primary-accent)] transition-colors">
                          {u.username}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)]">
                          {isOnline ? "Active Now" : "Offline"}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[var(--primary-accent)]/10 flex items-center justify-center text-[var(--primary-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiUserPlus size={18} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserListModal;
