// models/ReservationModel.js
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  cafe: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  people: { type: Number, required: true },
  agreeToTerms: { type: Boolean, required: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);