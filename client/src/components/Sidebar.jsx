import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPlus, FiUsers, FiArchive, FiLock, FiUnlock, FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import axios from "../api/axios";
import { updateRoom, setSidebarTab } from "../redux/slices/chatSlice";
import Avatar from "./Avatar";
import UserListModal from "./UserListModal";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = ({ rooms = [], onJoinRoom, activeRoomId }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { activeTab, onlineUsers } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  
  // Archive States
  const [isArchiveUnlocked, setIsArchiveUnlocked] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [archivePassword, setArchivePassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [archiveError, setArchiveError] = useState("");

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // ID Helper
  const currentUserId = (user?._id || user?.id)?.toString();

  // Search Filtering
  const searchFilteredRooms = rooms.filter((room) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = room.name?.toLowerCase().includes(query);
    const userMatch = !room.isGroup && room.users?.some(u => 
      u._id?.toString() !== currentUserId && u.username?.toLowerCase().includes(query)
    );
    return nameMatch || userMatch;
  });

  // Archive Sorting & Filtering
  const archivedRooms = searchFilteredRooms.filter(r => 
    (r.archivedBy || []).map(id => id.toString()).includes(currentUserId)
  );
  const unarchivedRooms = searchFilteredRooms.filter(r => 
    !(r.archivedBy || []).map(id => id.toString()).includes(currentUserId)
  );

  const getDisplayedRooms = () => {
    if (activeTab === "archive") return isArchiveUnlocked ? archivedRooms : [];
    if (activeTab === "groups") return unarchivedRooms.filter(r => r.isGroup);
    if (activeTab === "contacts") return unarchivedRooms.filter(r => !r.isGroup);
    return unarchivedRooms;
  };

  const displayedRooms = getDisplayedRooms();

  // Archive Logic
  const handleToggleArchive = async (e, roomId) => {
    e.stopPropagation();
    try {
      const response = await axios.put(`/chatrooms/${roomId}/archive`);
      dispatch(updateRoom(response.data.room));
    } catch (error) {
      console.error("Archive toggle failed:", error);
    }
  };

  const handleUnlockArchive = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setArchiveError("");
    try {
      const response = await axios.post("/auth/verify-password", { password: archivePassword });
      if (response.data.success) {
        setIsArchiveUnlocked(true);
        setShowUnlockModal(false);
        setArchivePassword("");
        dispatch(setSidebarTab("archive"));
      }
    } catch (err) {
      setArchiveError(err.response?.data?.message || "Invalid password");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full md:w-[320px] lg:w-[350px] h-screen bg-[var(--bg-rooms-list)] border-r border-[var(--border-color)] flex flex-col flex-shrink-0 z-10 relative transition-colors">
      <UserListModal isOpen={showUserList} onClose={() => setShowUserList(false)} onChatStarted={onJoinRoom} />
      <CreateGroupModal isOpen={showCreateGroup} onClose={() => setShowCreateGroup(false)} onGroupCreated={onJoinRoom} />
      
      {/* Premium Vault Lock Overlay */}
      <AnimatePresence>
        {showUnlockModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-[var(--bg-rooms-list)]/98 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[var(--primary-accent)]/10 flex items-center justify-center mb-6 rotate-12">
              <FiLock size={32} className="text-[var(--primary-accent)]" />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-main)] mb-2 tracking-tight">Private Vault</h3>
            <p className="text-sm text-[var(--text-muted)] mb-8 max-w-[220px] font-medium">Verify your identity to access your archived conversations.</p>
            
            <form onSubmit={handleUnlockArchive} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={archivePassword}
                  onChange={(e) => setArchivePassword(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-2xl p-4 focus:ring-2 focus:ring-[var(--primary-accent)] outline-none text-center font-bold tracking-widest placeholder:tracking-normal placeholder:font-normal"
                  autoFocus
                />
              </div>
              {archiveError && <p className="text-red-500 text-xs font-bold animate-pulse">{archiveError}</p>}
              <button 
                type="submit" 
                disabled={isVerifying || !archivePassword}
                className="w-full bg-[var(--primary-accent)] text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-500/30 disabled:opacity-50 transition-all hover:brightness-110 active:scale-95"
              >
                {isVerifying ? "Verifying..." : "Unlock Vault"}
              </button>
              <button 
                type="button" 
                onClick={() => setShowUnlockModal(false)}
                className="text-[var(--text-muted)] text-sm font-bold hover:text-[var(--text-main)] transition-colors pt-2"
              >
                Go Back
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 md:p-6 md:pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {activeTab === "archive" && (
              <button 
                onClick={() => dispatch(setSidebarTab("all_chats"))}
                className="mr-3 p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary-accent)] transition-all"
              >
                <FiArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl md:text-[28px] font-bold text-[var(--text-main)] tracking-tighter">
              {activeTab === "archive" ? "Private Vault" : "Messages"}
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCreateGroup(true)} className="w-10 h-10 rounded-xl bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] flex items-center justify-center hover:bg-[var(--primary-accent)] hover:text-white transition-all shadow-sm" title="New Group"><FiUsers size={18} /></button>
            <button onClick={() => setShowUserList(true)} className="w-10 h-10 rounded-xl bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] flex items-center justify-center hover:bg-[var(--primary-accent)] hover:text-white transition-all shadow-sm" title="New Chat"><FiPlus size={20} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--primary-accent)] transition-colors"><FiSearch size={18} /></div>
          <input type="text" placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[var(--bg-card)]/40 border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]/20 transition-all placeholder:text-[var(--text-muted)]/50" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 md:px-4 space-y-2 pb-10">
        
        {/* Archived Entry Row (WhatsApp Style) - Only in All Chats & if there are archives */}
        {activeTab === "all_chats" && archivedRooms.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => isArchiveUnlocked ? dispatch(setSidebarTab("archive")) : setShowUnlockModal(true)}
            className="w-full flex items-center p-4 rounded-3xl bg-gradient-to-r from-[var(--primary-accent)]/5 to-transparent border border-[var(--primary-accent)]/10 hover:from-[var(--primary-accent)]/10 transition-all mb-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary-accent)]/10 flex items-center justify-center text-[var(--primary-accent)] group-hover:scale-110 transition-all duration-300">
              <FiArchive size={22} />
            </div>
            <div className="ml-4 flex-1 text-left">
              <h4 className="text-sm font-bold text-[var(--text-main)]">Archived Chats</h4>
              <p className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider">{archivedRooms.length} Conversations</p>
            </div>
            <div className="flex items-center text-[var(--text-muted)] group-hover:text-[var(--primary-accent)] transition-colors">
              {!isArchiveUnlocked && <FiLock size={14} className="mr-2" />}
              <FiChevronRight size={18} />
            </div>
          </motion.button>
        )}

        <div className="px-2 pb-2">
          <span className="text-[11px] font-black text-[var(--text-muted)]/50 uppercase tracking-[0.2em]">
            {activeTab === "archive" ? "Protected Content" : activeTab === "groups" ? "Groups Only" : activeTab === "contacts" ? "Direct Messages" : "All Messages"}
          </span>
        </div>
        
        <AnimatePresence mode="popLayout">
          {displayedRooms.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-[var(--bg-card)] flex items-center justify-center mb-4 text-[var(--text-muted)]/20 shadow-inner"><FiArchive size={32} /></div>
              <p className="text-[var(--text-muted)] text-sm font-bold tracking-tight">{activeTab === "archive" ? "Your vault is empty." : "No messages found."}</p>
            </motion.div>
          ) : (
            displayedRooms.map((room) => {
              const isActive = room._id === activeRoomId;
              const isArchived = (room.archivedBy || []).map(id => id.toString()).includes(currentUserId);
              
              let displayName = room.name;
              let displayAvatar = null;
              let isOnline = false;

              if (!room.isGroup) {
                const otherUser = room.users?.find(u => u._id?.toString() !== currentUserId);
                if (otherUser) {
                  displayName = otherUser.username;
                  displayAvatar = otherUser.avatar;
                  isOnline = onlineUsers.some(u => (u.userId || u.id)?.toString() === otherUser._id?.toString());
                } else if (displayName?.startsWith("private-")) {
                  displayName = "Chat";
                }
              }

              const time = room.lastMessage ? new Date(room.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(room.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const lastMsg = room.lastMessage ? (room.isGroup ? `${room.lastMessage.username}: ` : "") + (room.lastMessage.content?.length > 30 ? room.lastMessage.content.substring(0, 30) + "..." : (room.lastMessage.content || "")) : "Start a new conversation";
              
              return (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} key={room._id} onClick={() => onJoinRoom(room._id)}
                  className={`group w-full flex items-start p-4 rounded-3xl transition-all duration-300 text-left relative overflow-hidden cursor-pointer mb-2 border ${
                    isActive 
                      ? "bg-[var(--bg-card)] border-[var(--border-color)] shadow-xl scale-[1.02] z-10" 
                      : room.unreadCount > 0
                        ? "bg-[var(--primary-accent)]/5 border-[var(--primary-accent)]/20 shadow-lg shadow-[var(--primary-accent)]/5"
                        : "hover:bg-[var(--bg-card)]/40 border-transparent"
                  }`}
                >
                  {/* Unread Glow Effect */}
                  {room.unreadCount > 0 && !isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-accent)]/10 to-transparent pointer-events-none" />
                  )}

                  {room.isGroup ? (
                    <Avatar src={displayAvatar} alt={displayName} size="lg" initials={displayName?.substring(0, 2).toUpperCase()} status={null} />
                  ) : (
                    <Avatar src={displayAvatar} alt={displayName} size="lg" initials={displayName?.substring(0, 2).toUpperCase()} status={isOnline ? "online" : null} />
                  )}
                
                  <div className="ml-4 flex-1 min-w-0 z-10">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center truncate pr-2">
                        <h3 className={`text-base font-bold truncate transition-colors ${room.unreadCount > 0 ? "text-[var(--primary-accent)]" : "text-[var(--text-main)]"}`}>{displayName}</h3>
                        {room.unreadCount > 0 && (
                          <span className="ml-2 w-2 h-2 rounded-full bg-[var(--primary-accent)] animate-pulse" />
                        )}
                      </div>
                      <span className={`text-[10px] font-black tracking-tighter flex-shrink-0 ${room.unreadCount > 0 ? "text-[var(--primary-accent)]" : "text-[var(--text-muted)]"}`}>{time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate pr-2 font-medium transition-colors ${room.unreadCount > 0 ? "text-[var(--text-main)] font-bold" : isActive ? "text-[var(--text-main)]/70" : "text-[var(--text-muted)]"}`}>{lastMsg}</p>
                      {room.unreadCount > 0 && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-[var(--primary-accent)] flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 shadow-lg shadow-pink-500/40 border-2 border-white dark:border-zinc-900"
                        >
                          {room.unreadCount}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Archive Quick Action */}
                  <button
                    onClick={(e) => handleToggleArchive(e, room._id)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 hidden md:flex ${isArchived ? "bg-[var(--primary-accent)] text-white scale-100" : "bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary-accent)] hover:scale-110 active:scale-95"}`}
                    title={isArchived ? "Unarchive Conversation" : "Archive Conversation"}
                  >
                    <FiArchive size={18} />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;
