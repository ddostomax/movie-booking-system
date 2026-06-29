import { motion } from "framer-motion";

export function Button({ children, className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400/60 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-500 text-white shadow-glow hover:bg-indigo-400 active:bg-indigo-500/90",
    ghost: "bg-white/5 text-zinc-200 hover:bg-white/10",
    danger: "bg-rose-500 text-white hover:bg-rose-400"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

