import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Input = forwardRef(
  ({ label, error, icon: Icon, rightIcon: RightIcon, onRightIconClick, className = "", ...props }, ref) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Icon size={20} />
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full h-12 rounded-xl border bg-[var(--bg-card)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent transition-all duration-300 ${
              error ? "border-red-500 focus:ring-red-500" : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
            } ${Icon ? "pl-12" : "pl-4"} ${RightIcon ? "pr-12" : "pr-4"} text-base`}
            {...props}
          />
          {RightIcon && (
            <div
              className={`absolute inset-y-0 right-0 pr-4 flex items-center ${
                onRightIconClick ? "cursor-pointer hover:text-[var(--primary-accent)] transition-colors" : "pointer-events-none"
              } text-[var(--text-muted)]`}
              onClick={onRightIconClick}
            >
              <RightIcon size={20} />
            </div>
          )}
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
