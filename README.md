# Book That Show!! – Mini BookMyShow Clone

A full-stack movie ticket booking web application inspired by BookMyShow, built from scratch as a solo full-stack project.

https://github.com/Anubhab-del/Book-My-Show

## Features

- Browse and select from a hardcoded list of movies
- Choose from predefined time slots (10:00 AM, 01:00 PM, 03:00 PM, 08:00 PM)
- Select number of seats for different types (A1, A2, A3, A4, D1, D2)
- Seat inputs have correct IDs (`seat-A1`, `seat-A2`, etc.)
- Visual selection feedback using proper class names:
  - `movie-column-selected`
  - `slot-column-selected`
  - `seat-column-selected` (when quantity > 0)
- Real-time **total price** display (₹180 per seat)
- **Countdown timer** to selected showtime (updates every minute)
- Gentle red error message + shake animation if no seats are selected
- **Dark mode toggle** (persisted in localStorage)
- **Last Booking Details** section showing the most recent booking
- "Book This Again" button to pre-fill form from last booking
- Selections (movie, slot, seats) persist on page reload using localStorage
- Single **POST** request to backend on booking
- On success: update last booking UI without extra GET, clear form & localStorage
- Fallback message: "no previous booking found" if no bookings exist
- Data saved in MongoDB using Mongoose schema

## Tech Stack

- **Frontend**: React 18, Webpack 5, Babel, CSS (variables + dark mode)
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (local)
- **Proxy**: Webpack Dev Server proxies `/api` to backend on port 8080

## Project Structure



Book-My-Show/
├── backend/                      # Express API + MongoDB connection
│   ├── index.js                  # Main server (port 8080)
│   ├── connector.js              # Mongoose connection
│   ├── schema.js                 # Booking schema
│   └── package.json
│
├── frontend/                     # React + Webpack application (port 3000)
│   ├── src/
│   │   ├── App.js                # Main component (all UI logic)
│   │   ├── App.css               # Styles (dark mode, shake animation, etc.)
│   │   ├── index.js
│   │   └── index.html
│   ├── webpack.config.js         # Webpack config + proxy
│   ├── .babelrc                  # Babel presets
│   └── package.json
│
└── README.md
text## Setup & Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally (or MongoDB Atlas)

### 1. Backend (API + Database)
```bash
cd backend
npm install
npm start
→ Server runs on http://localhost:8080
→ Logs: "MongoDB connected" and "Backend running"
2. Frontend (React App)
Bashcd frontend
npm install
npm start
→ Opens http://localhost:3000 in browser
→ Proxies /api/* requests to backend automatically



Author
Anubhab
GitHub: @Anubhab-del
Made for learning full-stack development in Collaboration with AlmaBetter

