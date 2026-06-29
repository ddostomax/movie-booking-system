import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [movie, setMovie] = useState(null);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userId, setUserId] = useState(1);
  const [bookingId, setBookingId] = useState(null);

  const reset = useCallback(() => {
    setSelectedSeats([]);
    setBookingId(null);
  }, []);

  const value = useMemo(
    () => ({
      movie,
      setMovie,
      show,
      setShow,
      selectedSeats,
      setSelectedSeats,
      userId,
      setUserId,
      bookingId,
      setBookingId,
      reset
    }),
    [movie, show, selectedSeats, userId, bookingId, reset]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

