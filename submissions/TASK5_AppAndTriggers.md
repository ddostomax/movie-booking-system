## Task 5 — Application (Embedded SQL) + Triggers

### Application

Backend: `../backend/` (Express + `mysql2`)

Key endpoints:
- `GET /movies` — list movies
- `GET /shows?movie_id=...` — list shows with theatre + screen info
- `GET /seats/:show_id` — list show seat inventory with status
- `POST /book` — creates a booking **transactionally**
  - Input: `user_id`, `show_id`, `show_seat_ids[]`
  - Logic (transaction):
    - `SELECT ... FOR UPDATE` on requested seats to prevent race/double booking
    - Insert `BOOKING` (Pending)
    - Insert `TICKET` rows (one per selected seat)
    - Trigger marks seats `Booked`
  - Output: `booking_id`
- `POST /payment` — inserts payment
  - Input: `booking_id`, `amount`, `method`
  - Inserts into `PAYMENT`
  - Trigger updates `BOOKING.status` to Confirmed/Cancelled
  - Backend additionally releases seats + deletes tickets on failed payment (simple & clean)

### Triggers (2+)

Defined in `../schema.sql`:

1) **`prevent_double_booking`** (BEFORE INSERT on `TICKET`)
- Checks `SHOW_SEAT.status`
- If already `Booked`, raises an error (`SIGNAL SQLSTATE '45000'`)

2) **`update_seat_after_ticket`** (AFTER INSERT on `TICKET`)
- Automatically sets `SHOW_SEAT.status = 'Booked'` for the inserted ticket seat

3) **`update_booking_status`** (AFTER INSERT on `PAYMENT`)
- Sets `BOOKING.status` to `Confirmed` if payment successful, else `Cancelled`

### How to run

1) Load DB:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_booking;"
mysql -u root -p movie_booking < schema.sql
mysql -u root -p movie_booking < data.sql
```

2) Start backend:

```bash
cd backend
DB_USER=root DB_PASSWORD="(your password)" DB_NAME=movie_booking npm start
```

3) Start frontend:

```bash
cd frontend
PORT=3001 npm start
```

