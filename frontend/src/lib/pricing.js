// Mirrors the per-seat-type prices the backend charges in backend/index.js (priceForType).
export const PRICE_BY_TYPE = {
  Regular: 250,
  Premium: 350,
  VIP: 500
};

export function seatLabel(seat) {
  return `${seat.row_num}${seat.seat_num}`;
}
