import React, { useState, useEffect } from 'react';

const movies = [
  "Suraj par mangal bhari",
  "Tenet",
  "The war with grandpa",
  "The personal history of David Copperfield",
  "Come Play"
];

const slots = ["10:00 AM", "01:00 PM", "03:00 PM", "08:00 PM"];

const seatTypes = ["A1", "A2", "A3", "A4", "D1", "D2"];

function App() {
  // Existing states
  const [selectedMovie, setSelectedMovie] = useState(localStorage.getItem('movie') || '');
  const [selectedSlot, setSelectedSlot] = useState(localStorage.getItem('slot') || '');
  const [seats, setSeats] = useState(
    JSON.parse(localStorage.getItem('seats')) || {
      A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0
    }
  );
  const [lastBooking, setLastBooking] = useState(null);

  // States for existing features
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [showSeatError, setShowSeatError] = useState(false);

  // New state for countdown
  const [countdown, setCountdown] = useState('');

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Load last booking once on mount
  useEffect(() => {
    fetch('/api/booking')
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setLastBooking({ message: data.message });
        } else {
          setLastBooking(data);
        }
      })
      .catch(() => setLastBooking({ message: "no previous booking found" }));
  }, []);

  // Save selections to localStorage
  useEffect(() => {
    localStorage.setItem('movie', selectedMovie);
  }, [selectedMovie]);

  useEffect(() => {
    localStorage.setItem('slot', selectedSlot);
  }, [selectedSlot]);

  useEffect(() => {
    localStorage.setItem('seats', JSON.stringify(seats));
  }, [seats]);

  // Countdown to showtime (updates every minute)
  useEffect(() => {
    const updateCountdown = () => {
      if (!selectedSlot) {
        setCountdown('');
        return;
      }

      const now = new Date();
      const [timeStr, period] = selectedSlot.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const showTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

      if (showTime < now) {
        showTime.setDate(showTime.getDate() + 1);
      }

      const diffMs = showTime - now;
      const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hoursLeft <= 0 && minutesLeft <= 0) {
        setCountdown("Show already started!");
      } else if (hoursLeft === 0 && minutesLeft < 5) {
        setCountdown("Starting very soon!");
      } else {
        setCountdown(`Starts in ${hoursLeft > 0 ? hoursLeft + 'h ' : ''}${minutesLeft}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // every minute

    return () => clearInterval(interval);
  }, [selectedSlot]);

  const handleSeatChange = (type) => (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setSeats(prev => ({ ...prev, [type]: value }));
  };

  const handleBookNow = async () => {
    const totalSeats = Object.values(seats).reduce((sum, num) => sum + num, 0);

    if (!selectedMovie || !selectedSlot || totalSeats === 0) {
      setShowSeatError(true);
      setTimeout(() => setShowSeatError(false), 4000);
      return;
    }

    const bookingData = {
      movie: selectedMovie,
      slot: selectedSlot,
      seats
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setLastBooking(bookingData);
        setSelectedMovie('');
        setSelectedSlot('');
        setSeats({ A1: 0, A2: 0, A3: 0, A4: 0, D1: 0, D2: 0 });
        localStorage.removeItem('movie');
        localStorage.removeItem('slot');
        localStorage.removeItem('seats');
        alert("Booking successful!");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Check console for details.");
    }
  };

  // Price calculation
  const pricePerSeat = 180;
  const totalSeatsCount = Object.values(seats).reduce((sum, num) => sum + num, 0);
  const totalPrice = totalSeatsCount * pricePerSeat;

  return (
    <div className="container">
      <h1>Book that show!!</h1>

      {/* Dark Mode Toggle */}
      <div style={{
        position: 'absolute',
        top: '32px',
        right: '32px',
        zIndex: 10
      }}>
        <button
          onClick={() => setDarkMode(prev => !prev)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.8rem',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'transform 0.2s'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="main-layout">
        <div className="selection-section">
          <h2>Select A Movie</h2>
          <div className="movie-row">
            {movies.map(movie => (
              <div
                key={movie}
                className={`movie-column ${selectedMovie === movie ? 'movie-column-selected' : ''}`}
                onClick={() => setSelectedMovie(movie)}
              >
                {movie}
              </div>
            ))}
          </div>

          <h2>Select a Time slot</h2>
          <div className="slot-row">
            {slots.map(slot => (
              <div
                key={slot}
                className={`slot-column ${selectedSlot === slot ? 'slot-column-selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </div>
            ))}
          </div>

          {/* Countdown to selected slot */}
          {selectedSlot && countdown && (
            <p style={{
              marginTop: '12px',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: darkMode ? '#93c5fd' : '#1d4ed8',
              textAlign: 'center',
              background: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(219, 234, 254, 0.6)',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'inline-block',
              width: 'fit-content',
              margin: '12px auto',
              display: 'block'
            }}>
              {countdown}
            </p>
          )}

          <h2>Select the seats</h2>
          <div className="seats-container">
            <div className="seat-row">
              {["A1", "A2", "A3", "A4"].map(type => (
                <div
                  key={type}
                  className={`seat-column ${seats[type] > 0 ? 'seat-column-selected' : ''}`}
                >
                  <span>Type {type}</span>
                  <input
                    type="number"
                    min="0"
                    value={seats[type]}
                    onChange={handleSeatChange(type)}
                  />
                </div>
              ))}
            </div>

            <div className="seat-row">
              {["D1", "D2"].map(type => (
                <div
                  key={type}
                  className={`seat-column ${seats[type] > 0 ? 'seat-column-selected' : ''}`}
                >
                  <span>Type {type}</span>
                  <input
                    type="number"
                    min="0"
                    value={seats[type]}
                    onChange={handleSeatChange(type)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div style={{
            margin: '24px auto',
            padding: '12px 24px',
            background: totalSeatsCount > 0 ? '#dbeafe' : '#f1f5f9',
            borderRadius: '999px',
            display: 'inline-block',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: totalSeatsCount > 0 ? '#1d4ed8' : '#64748b'
          }}>
            Total: ₹{totalPrice.toLocaleString()}
            {totalSeatsCount > 0 && ` (${totalSeatsCount} seat${totalSeatsCount > 1 ? 's' : ''})`}
          </div>

          {/* No Seats Error */}
          {showSeatError && (
            <p style={{
              color: '#ef4444',
              fontWeight: 500,
              marginTop: '16px',
              textAlign: 'center',
              animation: 'shake 0.5s'
            }}>
              Please select at least one seat to continue
            </p>
          )}

          <button className="book-now-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>

        <div className="last-booking-section">
          <h2>Last Booking Details:</h2>
          {lastBooking?.message ? (
            <p>{lastBooking.message}</p>
          ) : lastBooking ? (
            <>
              <p>seats:</p>
              {seatTypes.map(type => (
                <p key={type}>
                  {type}: {lastBooking.seats[type] || 0}
                </p>
              ))}
              <p>slot: {lastBooking.slot}</p>
              <p>movie: {lastBooking.movie}</p>

              {/* Quick Book Again Button */}
              <button
                onClick={() => {
                  setSelectedMovie(lastBooking.movie);
                  setSelectedSlot(lastBooking.slot);
                  setSeats({ ...lastBooking.seats });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="quick-book-btn"
              >
                Book This Again
              </button>
            </>
          ) : (
            <p>Loading last booking...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;