-- Task 4: 15+ SQL Queries (varying complexity)
-- Use: mysql -u root -p movie_booking < submissions/TASK4_Queries.sql

-- Q1: List all movies
SELECT movie_id, title, genre, language, duration
FROM MOVIE
ORDER BY title;

-- Q2: Theatres with screens
SELECT t.theatre_id, t.name AS theatre_name, t.location, t.city,
       s.screen_id, s.screen_name, s.total_seats
FROM THEATRE t
JOIN SCREEN s ON s.theatre_id = t.theatre_id
ORDER BY t.name, s.screen_name;

-- Q3: Shows with movie + theatre + screen (join chain)
SELECT sh.show_id, m.title AS movie_title, sh.show_date, sh.start_time,
       th.name AS theatre_name, sc.screen_name
FROM SHOWS sh
JOIN MOVIE m ON m.movie_id = sh.movie_id
JOIN SCREEN sc ON sc.screen_id = sh.screen_id
JOIN THEATRE th ON th.theatre_id = sc.theatre_id
ORDER BY sh.show_date, sh.start_time;

-- Q4: Shows for a given movie (parameter example)
-- SET @movie_id = 1;
-- SELECT ... WHERE sh.movie_id=@movie_id;
SELECT sh.show_id, sh.show_date, sh.start_time, sc.screen_name, th.name AS theatre_name
FROM SHOWS sh
JOIN SCREEN sc ON sc.screen_id = sh.screen_id
JOIN THEATRE th ON th.theatre_id = sc.theatre_id
WHERE sh.movie_id = 1
ORDER BY sh.show_date, sh.start_time;

-- Q5: Seat inventory for a show with status
SELECT ss.show_id, st.row_num, st.seat_num, st.type, ss.status
FROM SHOW_SEAT ss
JOIN SEAT st ON st.seat_id = ss.seat_id
WHERE ss.show_id = 1
ORDER BY st.row_num, st.seat_num;

-- Q6: Available seats count per show
SELECT ss.show_id,
       SUM(ss.status='Available') AS available_count,
       COUNT(*) AS total_count
FROM SHOW_SEAT ss
GROUP BY ss.show_id
ORDER BY ss.show_id;

-- Q7: Booked seats (seat labels) for a show
SELECT ss.show_id,
       CONCAT(st.row_num, st.seat_num) AS seat_label,
       st.type
FROM SHOW_SEAT ss
JOIN SEAT st ON st.seat_id = ss.seat_id
WHERE ss.show_id = 1 AND ss.status='Booked'
ORDER BY st.row_num, st.seat_num;

-- Q8: Booking list with user + show + movie info
SELECT b.booking_id, b.status AS booking_status, b.booking_date,
       u.user_id, u.name AS user_name, u.email,
       sh.show_id, sh.show_date, sh.start_time,
       m.title AS movie_title
FROM BOOKING b
JOIN `USER` u ON u.user_id = b.user_id
JOIN SHOWS sh ON sh.show_id = b.show_id
JOIN MOVIE m ON m.movie_id = sh.movie_id
ORDER BY b.booking_date DESC;

-- Q9: Tickets for a booking (with seat labels)
SELECT t.ticket_id, t.booking_id, t.price,
       CONCAT(st.row_num, st.seat_num) AS seat_label,
       st.type
FROM TICKET t
JOIN SHOW_SEAT ss ON ss.show_seat_id = t.show_seat_id
JOIN SEAT st ON st.seat_id = ss.seat_id
WHERE t.booking_id = 1
ORDER BY seat_label;

-- Q10: Total revenue from successful payments
SELECT SUM(amount) AS total_revenue
FROM PAYMENT
WHERE status='Successful';

-- Q11: Revenue per movie (aggregation + joins)
SELECT m.movie_id, m.title,
       SUM(CASE WHEN p.status='Successful' THEN p.amount ELSE 0 END) AS revenue
FROM MOVIE m
LEFT JOIN SHOWS sh ON sh.movie_id = m.movie_id
LEFT JOIN BOOKING b ON b.show_id = sh.show_id
LEFT JOIN PAYMENT p ON p.booking_id = b.booking_id
GROUP BY m.movie_id, m.title
ORDER BY revenue DESC;

-- Q12: Most booked show (by booked seats)
SELECT ss.show_id, COUNT(*) AS booked_seats
FROM SHOW_SEAT ss
WHERE ss.status='Booked'
GROUP BY ss.show_id
ORDER BY booked_seats DESC
LIMIT 1;

-- Q13: Users who made at least 2 bookings (HAVING)
SELECT u.user_id, u.name, COUNT(*) AS bookings
FROM `USER` u
JOIN BOOKING b ON b.user_id = u.user_id
GROUP BY u.user_id, u.name
HAVING COUNT(*) >= 2
ORDER BY bookings DESC;

-- Q14: Movies with no shows scheduled (anti-join)
SELECT m.movie_id, m.title
FROM MOVIE m
LEFT JOIN SHOWS sh ON sh.movie_id = m.movie_id
WHERE sh.show_id IS NULL;

-- Q15: Seats that are VIP and booked for any show (selection + join)
SELECT ss.show_id, CONCAT(st.row_num, st.seat_num) AS seat_label
FROM SHOW_SEAT ss
JOIN SEAT st ON st.seat_id = ss.seat_id
WHERE st.type='VIP' AND ss.status='Booked'
ORDER BY ss.show_id, seat_label;

-- Q16: Nested query: bookings whose total ticket price > average booking total
SELECT x.booking_id, x.total_price
FROM (
  SELECT b.booking_id, COALESCE(SUM(t.price),0) AS total_price
  FROM BOOKING b
  LEFT JOIN TICKET t ON t.booking_id = b.booking_id
  GROUP BY b.booking_id
) x
WHERE x.total_price > (
  SELECT AVG(y.total_price) FROM (
    SELECT b2.booking_id, COALESCE(SUM(t2.price),0) AS total_price
    FROM BOOKING b2
    LEFT JOIN TICKET t2 ON t2.booking_id = b2.booking_id
    GROUP BY b2.booking_id
  ) y
)
ORDER BY x.total_price DESC;

