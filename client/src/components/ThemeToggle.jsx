import React from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../theme/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--primary-accent)] border border-[var(--border-color)] custom-shadow transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-main)]"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {theme === "dark" ? <FiMoon size={20} /> : <FiSun size={20} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
