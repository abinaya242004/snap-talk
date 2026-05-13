import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiMessageSquare, FiHash, FiUsers, FiLogOut, FiArchive } from "react-icons/fi";
import { TbMessageCircleHeart } from "react-icons/tb";
import { logout } from "../redux/slices/authSlice";
import { setSidebarTab } from "../redux/slices/chatSlice";

const AppNavigation = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const dispatch = useDispatch();
  
  const { rooms, activeTab } = useSelector((state) => state.chat);
  const totalUnread = rooms?.reduce((sum, room) => sum + (room.unreadCount || 0), 0) || 0;
  const unreadGroups = rooms?.filter(r => r.isGroup).reduce((sum, room) => sum + (room.unreadCount || 0), 0) || 0;
  const unreadContacts = rooms?.filter(r => !r.isGroup).reduce((sum, room) => sum + (room.unreadCount || 0), 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { id: "all_chats", label: "All Chats", icon: FiMessageSquare, badge: totalUnread },
    { id: "groups", label: "Groups", icon: FiHash, badge: unreadGroups },
    { id: "contacts", label: "Contacts", icon: FiUsers, badge: unreadContacts },
  ];

  return (
    <>
      {/* Desktop Navigation Sidebar */}
      <div className="w-[240px] md:w-[260px] h-screen bg-[var(--bg-app-nav)] border-r border-[var(--border-color)] flex-shrink-0 flex-col py-6 px-4 hidden md:flex">
        <div className="flex items-center mb-10 px-2 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-accent)] flex items-center justify-center mr-3 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-all duration-300">
            <TbMessageCircleHeart size={26} className="text-white" />
          </div>
          <span className="text-white font-black text-2xl tracking-tighter transition-all group-hover:text-[var(--primary-accent)] drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
            Snap Talk
          </span>
        </div>

        <div className="flex-1 flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                onClick={() => dispatch(setSidebarTab(item.id))}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-[var(--primary-accent)] text-white shadow-lg shadow-pink-500/20"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]"
                }`}
              >
                <div className="flex items-center">
                  <item.icon size={22} className={isActive ? "text-white" : "text-[var(--text-muted)] group-hover:text-[var(--primary-accent)] transition-colors"} />
                  <span className={`ml-4 text-sm font-bold ${isActive ? "text-white" : "text-[var(--text-muted)]"}`}>
                    {item.label}
                  </span>
                </div>
                {item.badge > 0 && (
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                    isActive ? "bg-white text-[var(--primary-accent)]" : "bg-[var(--primary-accent)] text-white"
                  }`}>
                    {item.badge}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border-color)]">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-2xl w-full text-[var(--text-nav)] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
          >
            <FiLogOut size={20} />
            <span className="ml-4 font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-app-nav)]/95 backdrop-blur-lg border-t border-[var(--border-color)] flex items-center justify-around px-4 z-[1000] ${roomId ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"} transition-all duration-300`}>
        {navItems.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setSidebarTab(item.id))}
              className={`flex flex-col items-center justify-center relative p-2 transition-all duration-300 ${
                isActive ? "text-[var(--primary-accent)]" : "text-[var(--text-muted)]"
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? "scale-110 -translate-y-1" : ""}`}>
                <item.icon size={24} />
              </div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? "opacity-100" : "opacity-70"}`}>
                {item.label.split(' ')[0]}
              </span>
              {item.badge > 0 && (
                <div className="absolute -top-1 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[var(--bg-app-nav)]">
                  {item.badge}
                </div>
              )}
            </button>
          );
        })}

        <button 
          onClick={handleLogout}
          className="flex flex-col items-center justify-center p-2 text-red-500/70"
        >
          <FiLogOut size={24} />
          <span className="text-[10px] mt-1 font-bold">Exit</span>
        </button>
      </div>
    </>
  );
};

export default AppNavigation;
