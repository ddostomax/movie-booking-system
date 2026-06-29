## Task 3 — Schema, Indexes, Constraints, Seed Data

### Schema
- File: `../schema.sql`
- Includes:
  - PKs with `AUTO_INCREMENT`
  - FKs with `ON DELETE CASCADE`
  - `ENUM` domains (booking/payment/seat status)
  - Indexes on key FKs (`movie_id`, `show_id`, `user_id`)
  - Triggers (see Task 5)

### Seed Data
- File: `../data.sql`
- Includes:
  - 5 users, 5 movies (Hindi + English)
  - 2 theatres in Delhi, 4 screens
  - 40 seats per screen (160 seats total)
  - 5 shows
  - Full show-wise seat inventory in `SHOW_SEAT` (200 rows)
  - Bookings, tickets, and payments (Successful + Failed)

