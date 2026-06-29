## Task 2 — Conceptual (E-R) + Relational Model

### E-R (Mermaid)

```mermaid
erDiagram
  USER ||--o{ BOOKING : makes
  MOVIE ||--o{ SHOWS : schedules
  THEATRE ||--|{ SCREEN : contains
  SCREEN ||--|{ SEAT : has
  SCREEN ||--o{ SHOWS : hosts
  SHOWS ||--o{ SHOW_SEAT : defines_inventory
  SEAT ||--o{ SHOW_SEAT : listed_as
  SHOWS ||--o{ BOOKING : reserved_in
  BOOKING ||--o{ TICKET : issues
  SHOW_SEAT ||--o{ TICKET : assigned_to
  BOOKING ||--|| PAYMENT : paid_by

  USER {
    int user_id PK
    string name
    string email UK
    string phone
    string password
  }
  MOVIE {
    int movie_id PK
    string title
    string genre
    string language
    int duration
  }
  THEATRE {
    int theatre_id PK
    string name
    string location
    string city
  }
  SCREEN {
    int screen_id PK
    int theatre_id FK
    string screen_name
    int total_seats
  }
  SEAT {
    int seat_id PK
    int screen_id FK
    string row_num
    int seat_num
    string type
  }
  SHOWS {
    int show_id PK
    int movie_id FK
    int screen_id FK
    date show_date
    time start_time
  }
  SHOW_SEAT {
    int show_seat_id PK
    int show_id FK
    int seat_id FK
    string status
  }
  BOOKING {
    int booking_id PK
    int user_id FK
    int show_id FK
    datetime booking_date
    string status
  }
  TICKET {
    int ticket_id PK
    int booking_id FK
    int show_seat_id FK
    decimal price
  }
  PAYMENT {
    int payment_id PK
    int booking_id FK UK
    decimal amount
    string method
    string status
    timestamp payment_time
  }
```

### Relational Model (implemented)

Implemented tables (see `../schema.sql`):
- `USER(user_id PK, name, email UNIQUE, phone, password)`
- `MOVIE(movie_id PK, title NOT NULL, genre, language, duration)`
- `THEATRE(theatre_id PK, name NOT NULL, location NOT NULL, city)`
- `SCREEN(screen_id PK, theatre_id FK, screen_name, total_seats)`
- `SEAT(seat_id PK, screen_id FK, row_num, seat_num, type, UNIQUE(screen_id,row_num,seat_num))`
- `SHOWS(show_id PK, movie_id FK, screen_id FK, show_date, start_time)`
- `SHOW_SEAT(show_seat_id PK, show_id FK, seat_id FK, status, UNIQUE(show_id,seat_id))`
- `BOOKING(booking_id PK, user_id FK, show_id FK, booking_date, status)`
- `TICKET(ticket_id PK, booking_id FK, show_seat_id FK, price)`
- `PAYMENT(payment_id PK, booking_id UNIQUE FK, amount, method, status, payment_time)`

Notes:
- The design uses `SHOW_SEAT` to represent **seat inventory per show** (critical for correctness).
- Tickets link a booking to specific `SHOW_SEAT` rows (supports multi-seat bookings).

