# 🎬 District Movies — Online Movie Ticket Booking System

A full-stack movie ticket booking app: browse now-playing movies, pick a showtime, select seats on a live seat map, and complete a checkout flow — backed by a relational schema with triggers that enforce seat-locking and booking-status rules at the database level.

Originally built as a DBMS course project (see [`submissions/`](./submissions) for the schema design write-up), then extended into a full app with a React frontend and an Express API.

## ✨ Features

- **Browse movies & showtimes** — search and filter now-playing movies, grouped showtimes by date
- **Interactive seat selection** — live seat map per show, colored by Available / Selected / Booked
- **Booking with race-condition safety** — seat rows are locked (`SELECT ... FOR UPDATE`) inside a transaction so two users can't book the same seat at once
- **Server-authoritative pricing** — both the booking total and the payment amount are calculated from the database (seat type → price), never trusted from the client
- **Database-enforced integrity** — MySQL triggers prevent double-booking a seat and keep booking status in sync with payment status
- **Simulated checkout** — a lightweight payment step (UPI / Card / Wallet) for demo purposes; no real payment gateway is wired up (see [Future Improvements](#-future-improvements))

## 🛠️ Tech Stack

- **Frontend:** React 19 (Create React App), React Router, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express 5, `mysql2`
- **Database:** MySQL (schema + triggers in [`schema.sql`](./schema.sql), seed data in [`data.sql`](./data.sql))

## 🏗️ Architecture

```
Frontend (React + Tailwind)
        │  browse → select seats → confirm booking → pay
        ▼
Backend (Express)  ──►  MySQL  (movies, shows, seats, bookings, tickets, payments)
```

The frontend never computes a price that gets charged — it only displays it. `POST /book` prices each ticket from the seat's type, and `POST /payment` re-derives the amount as `SUM(price)` over that booking's tickets, so a tampered client request can't change what's actually recorded as paid.

## 📁 Project Structure

```
movie-booking-system/
├── backend/         # Express server: routes + MySQL access (backend/index.js, backend/db.js)
├── frontend/        # React app (seat map, booking flow, checkout UI)
├── submissions/     # DBMS coursework: project scope, ER/relational design, queries
├── schema.sql       # MySQL schema (tables + triggers)
├── data.sql         # Seed data (movies, theatres, shows, sample bookings)
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A running MySQL server

### 1. Database setup

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_booking;"
mysql -u root -p movie_booking < schema.sql
mysql -u root -p movie_booking < data.sql   # optional sample data
```

### 2. Backend setup

```bash
cd backend
npm install
npm start
```

By default this connects to `movie_booking` on `localhost:3306` as `root` with no password, and listens on **port 3000**. To override any of that, set environment variables before `npm start`:

```bash
DB_HOST=127.0.0.1 DB_PORT=3306 DB_USER=root DB_PASSWORD=yourpassword DB_NAME=movie_booking PORT=3000 npm start
```

### 3. Frontend setup

```bash
cd frontend
npm install
PORT=3001 npm start
```

> The frontend talks to the API at `http://localhost:3000` (see `frontend/src/api.js`), and Create React App's dev server also defaults to port 3000 — so the frontend is started with `PORT=3001` to avoid clashing with the backend.

Once both are running: **frontend** → http://localhost:3001, **API** → http://localhost:3000.

## 💳 Checkout flow

Payment is simulated for demo purposes: pick UPI, Card, or Wallet and confirm — there's no real payment gateway integration. The amount charged is always the server-computed total for that booking's tickets, and a MySQL trigger flips the booking to `Confirmed` (or `Cancelled` on a failed payment) as soon as the payment row is inserted.

## 🧠 Technical highlights

- **Transactional booking:** `POST /book` locks the requested seats with `SELECT ... FOR UPDATE` inside a transaction, rejecting the request if any seat is already booked or invalid for that show — this is what actually prevents double-booking under concurrent requests.
- **Triggers do the bookkeeping:** `prevent_double_booking`, `update_seat_after_ticket`, and `update_booking_status` (all in `schema.sql`) keep seat status and booking status consistent regardless of which code path writes to the tables.
- **Normalized schema:** nine tables (`USER`, `MOVIE`, `THEATRE`, `SCREEN`, `SEAT`, `SHOWS`, `SHOW_SEAT`, `BOOKING`, `TICKET`, `PAYMENT`) modeling per-show seat inventory rather than a single global seat map. Full ER/relational design reasoning is in [`submissions/TASK2_ER_and_Relational.md`](./submissions/TASK2_ER_and_Relational.md).

## 📸 Screenshots / Demo

_Add screenshots or a short screen recording of the booking flow here, e.g.:_

| Home | Seat selection | Payment |
|---|---|---|
| `docs/screenshots/home.png` | `docs/screenshots/seats.png` | `docs/screenshots/payment.png` |

## 🔮 Future Improvements

- [ ] Integrate a real payment gateway (e.g. Stripe/Razorpay) instead of the simulated checkout
- [ ] User authentication and a booking history view
- [ ] Email confirmation on successful booking
- [ ] Stripe/gateway webhooks for asynchronous payment confirmation

## 👥 Team

Built by [@Goyamjain06](https://github.com/Goyamjain06) and [@ddostomax](https://github.com/ddostomax).
