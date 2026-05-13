import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FiInfo, FiArrowLeft } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";

const Header = ({ roomName, onlineUsersCount, roomAvatar, isGroup, isOnline, lastSeen }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { roomId } = useParams();

  return (
    <div className={`h-20 border-b border-[var(--border-color)] px-4 md:px-6 flex items-center justify-between flex-shrink-0 transition-all ${
      isGroup 
        ? "bg-gradient-to-r from-[var(--bg-chat)] to-[var(--primary-accent)]/5 backdrop-blur-md" 
        : "bg-[var(--bg-chat)]"
    }`}>
      <div className="flex items-center min-w-0">
        {/* Back Button for Mobile */}
        {roomId && (
          <button 
            onClick={() => navigate("/chat")}
            className="md:hidden mr-3 p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary-accent)] transition-all active:scale-90"
          >
            <FiArrowLeft size={20} />
          </button>
        )}
        {roomName && (
          <>
            {isGroup ? (
              <Avatar
                src={roomAvatar}
                alt={roomName}
                size="xl"
                initials={roomName?.substring(0, 2).toUpperCase()}
                className="mr-4 flex-shrink-0"
              />
            ) : (
              <Avatar
                src={roomAvatar}
                alt={roomName}
                size="xl"
                initials={roomName?.substring(0, 2).toUpperCase()}
                className="mr-4"
                status={isOnline ? "online" : null}
              />
            )}
          </>
        )}
        
        <div className="flex flex-col justify-center">
          <div className="flex items-center">
            <h2 className="font-bold text-xl text-[var(--text-main)] leading-none">
              {roomName || "Welcome to Snap Talk"}
            </h2>
            {isGroup && (
              <span className="ml-3 px-2 py-0.5 bg-[var(--primary-accent)]/10 text-[var(--primary-accent)] text-[10px] font-bold rounded-md uppercase tracking-wider border border-[var(--primary-accent)]/20">
                Group
              </span>
            )}
            {!isGroup && isOnline && (
              <div className="w-2 h-2 rounded-full bg-green-500 ml-2" />
            )}
          </div>
          {roomName && (
            <div className="flex items-center space-x-2 mt-1">
               <span className="text-[13px] text-[var(--text-muted)] font-medium">
                 {isGroup 
                   ? "Community Workspace" 
                   : isOnline 
                     ? "Active Now" 
                     : lastSeen 
                       ? `Last seen ${formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}`
                       : "Recently Active"}
               </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <ThemeToggle />
        
        <div className="hidden xs:block h-8 w-[1px] bg-[var(--border-color)] mx-1" />

        {/* User Profile Section */}
        <div className="flex items-center bg-[var(--bg-card)]/50 rounded-2xl px-2 md:px-4 py-2 border border-[var(--border-color)] group hover:bg-[var(--bg-card)] transition-all cursor-default">
          <div className="flex flex-col items-end mr-3 hidden lg:flex">
            <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-wider leading-none mb-1">Logged in as</span>
            <span className="text-sm font-bold text-[var(--text-main)] leading-none">{user?.username}</span>
          </div>
          <Avatar 
            src={null} 
            alt={user?.username} 
            size="md" 
            initials={user?.username?.substring(0, 1).toUpperCase()} 
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
