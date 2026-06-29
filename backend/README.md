# Movie Booking Backend (Express + MySQL)

## Setup

1. Create a MySQL database named `movie_booking` and run the SQL in:
   - `../schema.sql`
   - `../data.sql` (optional sample data)
2. Install deps:

```bash
cd backend
npm install
```

3. Start the API:

```bash
cd backend
# optional env vars:
# DB_HOST=127.0.0.1 DB_PORT=3306 DB_USER=root DB_PASSWORD= DB_NAME=movie_booking PORT=3000
npm start
```

## Endpoints

- `GET /movies`
- `GET /shows`
- `GET /seats/:show_id` (available seats only)
- `POST /book` body: `{ "user_id": 1, "show_id": 1 }`
- `POST /payment` body: `{ "booking_id": 1, "amount": 560, "method": "UPI" }`

