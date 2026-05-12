import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import Avatar from "./Avatar";

const ChatBubble = ({ message, isOwnMessage, sender }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex w-full mb-6 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[75%] md:max-w-[65%] ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isOwnMessage && (
          <div className="flex-shrink-0 mr-4 mt-auto mb-1">
            <Avatar
              src={sender?.avatar}
              alt={sender?.username}
              size="lg"
              initials={sender?.username?.substring(0, 2).toUpperCase()}
            />
          </div>
        )}

        <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
          <div
            className={`px-5 py-3 relative group ${
              isOwnMessage
                ? "bg-[var(--primary-accent)] text-white rounded-3xl rounded-br-sm"
                : "bg-[var(--bg-card)] text-[var(--text-main)] rounded-3xl rounded-bl-sm"
            }`}
          >
            {!isOwnMessage && (
              <p className="text-[15px] font-semibold mb-1 text-[var(--text-main)]">
                {sender?.username || "Unknown User"}
              </p>
            )}
            
            <p className={`text-[15px] leading-relaxed whitespace-pre-wrap break-words ${isOwnMessage ? "text-white" : "text-[var(--text-muted)]"}`}>
              {message.content}
            </p>
            
            <div
              className={`text-[11px] mt-2 text-right flex items-center justify-end space-x-1 ${
                isOwnMessage ? "text-white/80" : "text-[var(--text-muted)]/70"
              }`}
            >
              <span>{format(new Date(message.createdAt || Date.now()), "H:mm")}</span>
              <div className="flex -space-x-1">
                <FiCheck size={12} className={isOwnMessage ? "text-white" : "text-[var(--primary-accent)]"} />
                <FiCheck size={12} className={isOwnMessage ? "text-white" : "text-[var(--primary-accent)]"} />
              </div>
            </div>
          </div>
        </div>

        {isOwnMessage && (
          <div className="flex-shrink-0 ml-4 mt-auto mb-1">
            <Avatar
              src={sender?.avatar}
              alt={sender?.username}
              size="lg"
              initials={sender?.username?.substring(0, 2).toUpperCase()}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
