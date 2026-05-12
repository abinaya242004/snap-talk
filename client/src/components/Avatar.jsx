import React from "react";
import { motion } from "framer-motion";

const Avatar = ({ src, alt, size = "md", status, className = "", initials }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const statusSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
    xl: "w-4 h-4",
  };

  // Block the default Dicebear avatars to force initials
  const isDefaultAvatar = src && src.includes("dicebear.com");

  return (
    <div className={`relative inline-block ${className}`}>
      {src && !isDefaultAvatar ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className={`${sizes[size]} ${className.includes("rounded") ? "" : "rounded-full"} object-cover border-2 border-[var(--bg-main)] shadow-sm`}
        />
      ) : (
        <div
          className={`${sizes[size]} ${className.includes("rounded") ? "" : "rounded-full"} bg-gradient-to-br from-[var(--primary-accent)] to-[var(--secondary-accent)] flex items-center justify-center text-white font-bold border-2 border-[var(--bg-main)] shadow-sm`}
        >
          {initials || (alt ? alt.charAt(0).toUpperCase() : "?")}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-[var(--bg-main)] ${statusSizes[size]} ${
            status === "online"
              ? "bg-green-500"
              : status === "offline"
              ? "bg-gray-400"
              : status === "busy"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;
