import React from "react";
import { motion } from "framer-motion";

const Loader = ({ fullScreen = false }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 rounded-full bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)]"
            animate={{
              y: ["0%", "-50%", "0%"],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear", repeatType: "reverse" }}
        className="text-[var(--text-muted)] font-medium tracking-wider"
      >
        Loading...
      </motion.p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-main)] z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[200px]">
      {loaderContent}
    </div>
  );
};

export default Loader;
