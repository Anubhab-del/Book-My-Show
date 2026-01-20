const mongoose = require('mongoose');
const { bookMovieSchema } = require('./schema');

const uri = "mongodb://127.0.0.1:27017/bookMovie";

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

const Booking = mongoose.model('Booking', bookMovieSchema);

module.exports = { connection: Booking };