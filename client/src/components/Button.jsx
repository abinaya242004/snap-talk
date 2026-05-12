import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  fullWidth = false,
  disabled = false,
  type = "button",
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-main)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[var(--primary-accent)] hover:bg-[var(--primary-hover)] text-white focus:ring-[var(--primary-accent)] shadow-md hover:shadow-lg",
    secondary:
      "bg-[var(--bg-card)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-color)] focus:ring-[var(--border-color)]",
    ghost:
      "bg-transparent hover:bg-[var(--bg-chat)] text-[var(--text-muted)] hover:text-[var(--text-main)] focus:ring-[var(--bg-chat)]",
    danger:
      "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-md hover:shadow-lg",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-base font-semibold",
    lg: "h-12 px-6 text-lg font-bold",
    icon: "p-2",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className={children ? "mr-2" : ""} size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
    </motion.button>
  );
};

export default Button;
