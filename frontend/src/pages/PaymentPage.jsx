import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useBooking } from "../state/booking";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const PRICE_BY_TYPE = {
  Regular: 280,
  Premium: 420,
  VIP: 520
};

const METHODS = ["UPI", "Card", "Wallet"];

export function PaymentPage() {
  const navigate = useNavigate();
  const { bookingId, selectedSeats, reset } = useBooking();
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const total = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + (PRICE_BY_TYPE[s.type] || 280), 0),
    [selectedSeats]
  );

  async function payNow() {
    try {
      setLoading(true);
      setError("");
      const resp = await api.pay({ booking_id: bookingId, amount: total, method });
      setResult(resp);
    } catch (e) {
      setError(e.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  if (!bookingId) {
    return (
      <Card>
        <div className="text-sm text-zinc-200">No booking found. Please create a booking first.</div>
        <div className="mt-3">
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Payment</h2>
          <p className="text-sm text-zinc-400">Choose a method and complete payment.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info">Booking #{bookingId}</Badge>
            <Badge>Total ₹{total}</Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`rounded-2xl border p-4 text-left transition ${
                  method === m
                    ? "border-indigo-400/30 bg-indigo-500/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <div className="text-sm font-semibold">{m}</div>
                <div className="mt-1 text-xs text-zinc-400">Fast and secure</div>
              </button>
            ))}
          </div>

          {error ? <div className="text-sm text-rose-200">Error: {error}</div> : null}

          {result ? (
            <Card className="border-emerald-500/20 bg-emerald-500/10">
              <div className="text-sm text-emerald-100">
                Payment {result.payment_status} · Booking {result.booking_status}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    reset();
                    navigate("/");
                  }}
                >
                  Book Another
                </Button>
              </div>
            </Card>
          ) : (
            <Button onClick={payNow} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          )}
        </Card>

        <Card className="space-y-3">
          <div className="text-sm font-semibold">Price breakdown</div>
          <div className="space-y-2 text-sm text-zinc-300">
            {selectedSeats.map((s) => (
              <div key={s.show_seat_id} className="flex items-center justify-between">
                <span className="text-zinc-300">
                  {s.row_num}
                  {s.seat_num} <span className="text-zinc-500">({s.type})</span>
                </span>
                <span className="text-zinc-100">₹{PRICE_BY_TYPE[s.type] || 280}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="text-sm text-zinc-400">Total</span>
            <span className="text-lg font-semibold">₹{total}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

