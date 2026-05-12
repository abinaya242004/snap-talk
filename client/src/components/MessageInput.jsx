import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiSmile } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useTheme } from "../theme/ThemeContext";

const MessageInput = ({ onSendMessage, isTyping, onTyping }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { theme } = useTheme();
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (onTyping) onTyping();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full relative px-4 py-3 bg-[var(--bg-main)] border-t border-[var(--border-color)]">
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            ref={emojiPickerRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={theme === "dark" ? "dark" : "light"}
              autoFocusSearch={false}
              searchPlaceHolder="Search emojis..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSend}
        className="flex items-center space-x-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full p-1.5 custom-shadow transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-[var(--primary-accent)]/50 focus-within:border-[var(--primary-accent)]"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2.5 text-[var(--text-muted)] hover:text-[var(--primary-accent)] rounded-full transition-colors focus:outline-none"
        >
          <FiSmile size={22} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-0 px-2 py-2"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim()}
          className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
            message.trim()
              ? "bg-[var(--primary-accent)] text-white shadow-md hover:shadow-lg hover:bg-[var(--primary-hover)]"
              : "bg-[var(--bg-chat)] text-[var(--text-muted)] cursor-not-allowed"
          }`}
        >
          <FiSend size={20} className={message.trim() ? "ml-0.5" : ""} />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;
