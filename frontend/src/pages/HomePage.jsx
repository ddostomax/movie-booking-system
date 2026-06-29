import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useBooking } from "../state/booking";

export function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { setMovie, reset } = useBooking();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.getMovies();
        if (!alive) return;
        setMovies(data);
        reset();
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load movies");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [reset]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return movies;
    return movies.filter((m) => {
      const hay = `${m.title} ${m.genre || ""} ${m.language || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [movies, query]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-glow">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Now Playing</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">
              Book tickets like a pro — fast showtime browsing, seat map selection, and instant payment status.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="info">Delhi NCR</Badge>
              <Badge>Premium UI</Badge>
              <Badge tone="success">Live seats</Badge>
            </div>
          </div>

          <div className="w-full sm:w-[360px]">
            <label className="text-xs text-zinc-400">Search movies</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, genre, language..."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-400/40"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <Card className="border-rose-500/20 bg-rose-500/10">
          <div className="text-sm text-rose-100">Error: {error}</div>
          <div className="mt-2 text-xs text-rose-200/80">
            Make sure the backend is running at <span className="font-mono">http://localhost:3000</span>.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, idx) => (
            <motion.div
              key={m.movie_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
            >
              <button
                onClick={() => {
                  setMovie(m);
                  navigate(`/movies/${m.movie_id}/shows`);
                }}
                className="w-full text-left"
              >
                <Card className="group h-full transition hover:border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {m.poster_url ? (
                        <img
                          src={m.poster_url}
                          alt={m.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold leading-snug text-white group-hover:text-white">
                        {m.title}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {m.genre ? <Badge>{m.genre}</Badge> : null}
                        {m.language ? <Badge tone="info">{m.language}</Badge> : null}
                        {m.duration ? <Badge>{m.duration} min</Badge> : null}
                      </div>
                      {m.cast_names ? (
                        <div className="mt-2 line-clamp-1 text-[11px] text-zinc-400">
                          Cast: {m.cast_names}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-5 text-xs text-zinc-400">
                    Tap to view shows
                    <span className="ml-2 inline-block transition group-hover:translate-x-0.5">→</span>
                  </div>
                </Card>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

