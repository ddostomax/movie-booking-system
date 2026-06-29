import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useBooking } from "../state/booking";

function seatLabel(seat) {
  return `${seat.row_num}${seat.seat_num}`;
}

const PRICE_BY_TYPE = {
  Regular: 280,
  Premium: 420,
  VIP: 520
};

export function SeatsPage() {
  const { showId } = useParams();
  const showIdNum = Number(showId);
  const navigate = useNavigate();
  const { show, selectedSeats, setSelectedSeats } = useBooking();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await api.getSeats(showIdNum);
        if (!alive) return;
        setSeats(data.seats || []);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load seats");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [showIdNum]);

  const rows = useMemo(() => {
    const map = new Map();
    for (const s of seats) {
      const key = s.row_num;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    }
    const sorted = Array.from(map.entries()).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    for (const [, arr] of sorted) {
      arr.sort((a, b) => a.seat_num - b.seat_num);
    }
    return sorted;
  }, [seats]);

  const selectedMap = useMemo(() => new Set(selectedSeats.map((s) => s.show_seat_id)), [selectedSeats]);

  const total = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + (PRICE_BY_TYPE[s.type] || 280), 0);
  }, [selectedSeats]);

  function toggleSeat(seat) {
    if (seat.status === "Booked") return;
    setSelectedSeats((prev) => {
      const exists = prev.some((p) => p.show_seat_id === seat.show_seat_id);
      if (exists) return prev.filter((p) => p.show_seat_id !== seat.show_seat_id);
      return [...prev, seat];
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Select Seats</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="info">Show #{showIdNum}</Badge>
            {show?.screen_name ? <Badge>{show.screen_name}</Badge> : null}
            {show?.theatre_name ? <Badge>{show.theatre_name}</Badge> : null}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            onClick={() => navigate("/booking")}
            disabled={selectedSeats.length === 0}
            className="min-w-[140px]"
          >
            Continue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="space-y-4 lg:col-span-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-emerald-500/70" /> Available
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-rose-500/70" /> Booked
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-indigo-500/70" /> Selected
          </span>
          <span className="ml-auto text-zinc-400">
            Selected: <span className="text-zinc-200">{selectedSeats.length}</span> · Total:{" "}
            <span className="text-zinc-200">₹{total}</span>
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mx-auto mb-4 w-full max-w-xl rounded-full bg-white/10 py-2 text-center text-xs text-zinc-300">
            SCREEN
          </div>

          {loading ? (
            <div className="h-48 animate-pulse rounded-xl bg-white/[0.03]" />
          ) : error ? (
            <div className="text-sm text-rose-200">Error: {error}</div>
          ) : (
            <div className="space-y-3">
              {rows.map(([rowNum, rowSeats]) => (
                <div key={rowNum} className="flex items-center gap-3">
                  <div className="w-6 text-xs text-zinc-400">{rowNum}</div>
                  <div className="grid flex-1 grid-cols-10 gap-2">
                    {rowSeats.map((s) => {
                      const isSelected = selectedMap.has(s.show_seat_id);
                      const isBooked = s.status === "Booked";
                      const cls = isBooked
                        ? "bg-rose-500/50 border-rose-400/30 cursor-not-allowed"
                        : isSelected
                          ? "bg-indigo-500/60 border-indigo-400/30"
                          : "bg-emerald-500/40 border-emerald-400/20 hover:bg-emerald-500/55";

                      return (
                        <motion.button
                          key={s.show_seat_id}
                          whileHover={!isBooked ? { scale: 1.04 } : undefined}
                          whileTap={!isBooked ? { scale: 0.98 } : undefined}
                          onClick={() => toggleSeat(s)}
                          className={`h-9 rounded-lg border text-[11px] font-semibold text-white/90 transition ${cls}`}
                          title={`${seatLabel(s)} · ${s.type}`}
                        >
                          {s.seat_num}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </Card>

        <Card className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="text-sm font-semibold">Your cart</div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">Show #{showIdNum}</Badge>
            {show?.theatre_name ? <Badge>{show.theatre_name}</Badge> : null}
          </div>

          <div className="space-y-2">
            <div className="text-xs text-zinc-400">Selected seats</div>
            {selectedSeats.length === 0 ? (
              <div className="text-sm text-zinc-300">Pick seats from the map.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSeats
                  .slice()
                  .sort((a, b) => String(a.row_num).localeCompare(String(b.row_num)) || a.seat_num - b.seat_num)
                  .map((s) => (
                    <Badge key={s.show_seat_id}>{seatLabel(s)}</Badge>
                  ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">Total</div>
              <div className="text-lg font-semibold">₹{total}</div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setSelectedSeats([])}
                disabled={selectedSeats.length === 0}
              >
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate("/booking")}
                disabled={selectedSeats.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

