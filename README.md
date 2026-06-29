# Online Movie Ticket Booking System (Tasks 1–5)

This repo contains:
- **MySQL schema + seed data**: `schema.sql`, `data.sql`
- **Backend (Express + mysql2)**: `backend/`
- **Frontend (React + Tailwind + framer-motion)**: `frontend/`
- **Submission docs (Task 1–5)**: `submissions/`

## 1) Create DB + load schema/data

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS movie_booking;"
mysql -u root -p movie_booking < schema.sql
mysql -u root -p movie_booking < data.sql
```

## 2) Run backend

```bash
cd backend
DB_USER=root DB_PASSWORD="(your password)" DB_NAME=movie_booking npm start
```

Backend runs at `http://localhost:3000`.

## 3) Run frontend

```bash
cd frontend
PORT=3001 npm start
```

Frontend runs at `http://localhost:3001`.

# movie-booking-sytem
