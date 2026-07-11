🎬 Online Movie Ticket Booking System

A full-stack web application for browsing movies, selecting seats, and booking tickets with secure online card payments powered by Stripe. Built with a React frontend, an Express + MySQL backend, and Stripe's Payment Intents API for the checkout flow.


A team project modeling a real-world booking platform end to end — from seat selection to payment to persisted bookings.




✨ Features


Browse movies & showtimes — view available movies and schedules
Interactive seat selection — pick seats from a live seat map
Secure card payments — integrated Stripe (Payment Intents API) checkout
Booking persistence — confirmed bookings stored in MySQL
Server-side price calculation — amounts computed on the backend, never trusted from the client
Environment-based secrets — API keys kept out of source control via .env



🛠️ Tech Stack

Frontend: React (Create React App) · Tailwind CSS · Stripe Elements (@stripe/react-stripe-js)
Backend: Node.js · Express · mysql2
Database: MySQL
Payments: Stripe (Payment Intents API) — test mode


🏗️ Architecture

Frontend (React + Tailwind)
        │  seat selection → request payment
        ▼
Backend (Express)  ──►  Stripe API   (creates PaymentIntent, returns clientSecret)
        │
        ▼
   MySQL Database   (stores movies, seats, bookings)

The frontend never sees the Stripe secret key — it only receives a short-lived clientSecret to confirm the payment. The booking is saved only after Stripe confirms the payment succeeded.


📁 Project Structure

movie-booking-system/
├── backend/         # Express server, routes, Stripe + MySQL logic
├── frontend/        # React app (seat map, checkout UI)
├── submissions/     # Task submissions / documentation
├── schema.sql       # MySQL database schema
├── data.sql         # Seed data
└── .gitignore


🚀 Getting Started

Prerequisites


Node.js and npm
MySQL Server
A free Stripe account (for test API keys)


1. Database Setup

bashmysql -u root -p < schema.sql
mysql -u root -p < data.sql

2. Backend Setup

bashcd backend
npm install

# Create a .env file (this is git-ignored — never commit it)
# STRIPE_SECRET_KEY=sk_test_your_key_here
# DB_HOST=localhost, DB_USER=..., DB_PASSWORD=..., DB_NAME=...

npm start

3. Frontend Setup

bashcd frontend
npm install

# Create a .env file:
# REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

npm start

The app runs at http://localhost:3000 (frontend) and the API at http://localhost:5000 (backend).


💳 Testing Payments

Stripe runs in test mode — no real money is charged. Use Stripe's test card:

FieldValueCard number4242 4242 4242 4242ExpiryAny future date (e.g. 12/34)CVCAny 3 digitsZIPAny 5 digits

Successful payments appear in your Stripe Dashboard → Payments.


🔒 Security Notes


The Stripe secret key lives only on the backend, loaded via environment variables
Payment amounts are calculated server-side to prevent client-side tampering
.env files are excluded from version control via .gitignore



👥 Team

Built by @Goyamjain06 and @ddostomax.
[Optional: add one line on what you personally worked on — e.g. "I implemented the Stripe payment integration and the booking persistence flow."]


🔮 Future Improvements


 Stripe webhooks to confirm payments asynchronously (more robust than client confirmation)
 User authentication and booking history
 Email confirmation on successful booking
 Prevent double-booking of the same seat with DB-level locking
