const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { connection: Booking } = require('./connector');

app.use(cors());
app.use(bodyParser.json());

const PORT = 8080;

// GET last booking
app.get('/api/booking', async (req, res) => {
  try {
    const last = await Booking.findOne().sort({ createdAt: -1 });
    if (!last) {
      return res.json({ message: "no previous booking found" });
    }
    res.json({
      movie: last.movie,
      slot: last.slot,
      seats: last.seats
    });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

// POST new booking
app.post('/api/booking', async (req, res) => {
  try {
    const { movie, slot, seats } = req.body;

    const total = Object.values(seats || {}).reduce((a, b) => a + (b || 0), 0);

    if (!movie || !slot || total === 0) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const booking = new Booking({ movie, slot, seats });
    await booking.save();

    res.status(200).json({});
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running → http://localhost:${PORT}`);
});