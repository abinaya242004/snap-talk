import { formatDistanceToNow } from "date-fns";

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "just now";
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex gap-3 max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${
            isOwn
              ? "bg-gradient-to-br from-indigo-500 to-indigo-600"
              : "bg-gradient-to-br from-cyan-500 to-cyan-600"
          }`}
        >
          {message.user?.username?.charAt(0).toUpperCase() || "U"}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          <p className="text-xs text-gray-400 mb-1 px-3">
            {message.user?.username}
          </p>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none"
                : "bg-slate-700 text-gray-100 rounded-bl-none"
            }`}
          >
            <p className="break-words">{message.content}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 px-3">
            {formatTime(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
