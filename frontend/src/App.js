import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BookingProvider } from "./state/booking";
import { AppShell } from "./ui/AppShell";
import { HomePage } from "./pages/HomePage";
import { ShowsPage } from "./pages/ShowsPage";
import { SeatsPage } from "./pages/SeatsPage";
import { BookingPage } from "./pages/BookingPage";
import { PaymentPage } from "./pages/PaymentPage";

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:movieId/shows" element={<ShowsPage />} />
            <Route path="/shows/:showId/seats" element={<SeatsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BookingProvider>
    </BrowserRouter>
  );
}
