import { motion } from "framer-motion";

export function Card({ children, className = "", ...props }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-glow backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

