import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useBooking } from "../state/booking";

export function AppShell({ children }) {
  const location = useLocation();
  const { userId, setUserId } = useBooking();

  const users = [
    { id: 1, name: "Aarav" },
    { id: 2, name: "Isha" },
    { id: 3, name: "Kabir" },
    { id: 4, name: "Ananya" }
  ];

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.25]" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="group inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.75)]" />
            <span className="text-sm font-semibold tracking-wide text-zinc-100">
              District Movies
            </span>
            <span className="text-xs text-zinc-400 transition group-hover:text-zinc-200">
              book tickets
            </span>
          </Link>

          <nav className="hidden items-center gap-3 sm:flex">
            <div className="text-xs text-zinc-400">Booking as</div>
            <select
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-100 outline-none focus:border-indigo-400/40"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} (#{u.id})
                </option>
              ))}
            </select>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

