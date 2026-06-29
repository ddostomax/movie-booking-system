## Task 1 — Project Scope & Business Requirements

### Project Title
**Online Movie Ticket Booking System**

### Overview
An end-to-end database application to manage:
- Movies and their metadata (title, genre, language, duration)
- Theatres and screens
- Show scheduling
- Per-show seat availability
- Ticket booking and payments

### Users
- **Customers**: browse movies → choose show → select seats → pay → view booking
- **Theatre admins** (scope-lite): maintain movies/screens/shows
- **DBMS**: enforce integrity, prevent double booking, ensure consistency

### Key Business Requirements
- **Seat availability is tracked per show** (not globally).
- **Double booking must be prevented** for the same show/seat.
- **Booking references must be valid** (user + show must exist).
- **Payments**: status can be Successful/Failed; booking status updates accordingly.
- **Consistency**: booking + ticket issuance must be atomic.

