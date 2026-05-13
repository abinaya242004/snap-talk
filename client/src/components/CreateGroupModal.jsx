import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck, FiUsers } from "react-icons/fi";
import axios from "../api/axios";
import { useSelector, useDispatch } from "react-redux";
import { setRooms, addRoom } from "../redux/slices/chatSlice";
import Avatar from "./Avatar";
import socket from "../socket/socket";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("/chatrooms/users");
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

  const toggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setSubmitting(true);
    try {
      const response = await axios.post("/chatrooms", { 
        name: groupName, 
        users: [...selectedUsers, (currentUser.id || currentUser._id)] 
      });
      
      const newRoom = response.data.room;

      if (newRoom) {
        // Optimistically add room
        dispatch(addRoom(newRoom));
        
        // Notify others via socket
        socket.emit("createRoom", newRoom);
        
        // Navigate immediately
        onGroupCreated(newRoom._id);
        onClose();
        
        // Reset
        setGroupName("");
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Group creation failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

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
            <form onSubmit={handleCreateGroup}>
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--text-main)]">Create Group</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] text-[var(--text-muted)] transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-muted)] mb-2 px-1">Group Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter group name..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl py-3 px-4 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary-accent)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-muted)] mb-3 px-1">
                    Select Members ({selectedUsers.length})
                  </label>
                  <div className="max-h-[240px] overflow-y-auto space-y-1 custom-scrollbar pr-2">
                    {loading ? (
                      <div className="text-center py-4 text-xs text-[var(--text-muted)]">Loading users...</div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-10 px-4">
                        <p className="text-sm text-[var(--text-muted)] italic">
                          No other users found. Register another account in an incognito tab to create a group!
                        </p>
                      </div>
                    ) : (
                      users.map((u) => (
                        <button
                          key={u._id}
                          type="button"
                          onClick={() => toggleUser(u._id)}
                          className={`w-full flex items-center p-3 rounded-2xl transition-all text-left ${
                            selectedUsers.includes(u._id) 
                              ? "bg-[var(--primary-accent)]/10 ring-1 ring-[var(--primary-accent)]/30" 
                              : "hover:bg-[var(--bg-card)]"
                          }`}
                        >
                          <Avatar
                            src={u.avatar}
                            alt={u.username}
                            size="md"
                            initials={u.username.substring(0, 2).toUpperCase()}
                          />
                          <span className="ml-3 flex-1 font-medium text-[var(--text-main)]">{u.username}</span>
                          {selectedUsers.includes(u._id) && (
                            <div className="w-5 h-5 rounded-full bg-[var(--primary-accent)] flex items-center justify-center text-white">
                              <FiCheck size={12} strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[var(--bg-card)]/30 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !groupName.trim() || selectedUsers.length === 0}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold bg-[var(--primary-accent)] text-white shadow-lg shadow-pink-500/20 disabled:opacity-50 hover:opacity-90 transition-all flex items-center justify-center"
                >
                  {submitting ? "Creating..." : "Create Group"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;
