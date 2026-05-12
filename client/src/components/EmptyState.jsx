import React from "react";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

const EmptyState = ({ title, description, icon: Icon = FiInbox, action }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-24 h-24 rounded-full bg-[var(--bg-chat)] flex items-center justify-center text-[var(--text-muted)] mb-6 shadow-inner"
      >
        <Icon size={48} className="text-[var(--primary-accent)]/80" />
      </motion.div>
      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl font-bold text-[var(--text-main)] mb-2"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base text-[var(--text-muted)] max-w-md mb-8"
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
};

export default EmptyState;
