import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-main)] overflow-hidden font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center px-6"
      >
        {/* Compact 404 Bubble */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-48 h-48 md:w-56 md:h-56 bg-[var(--primary-accent)] rounded-[40px] rounded-bl-lg shadow-lg flex items-center justify-center mb-8"
        >
          <span className="text-white text-6xl md:text-7xl font-bold">404</span>
        </motion.div>

        {/* Simple Text */}
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">
          Page Not Found
        </h1>
        <p className="text-[var(--text-muted)] text-base mb-8">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-[var(--primary-accent)] text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
        >
          <FiHome size={20} />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
