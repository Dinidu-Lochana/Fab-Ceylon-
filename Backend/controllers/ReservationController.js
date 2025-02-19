// controllers/ReservationController.js
const Reservation = require("../models/ReservationModel");

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { cafe, date, time, people, agreeToTerms } = req.body;

    // Validate required fields
    if (!cafe || !date || !time || !people || !agreeToTerms) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new reservation
    const newReservation = new Reservation({
      cafe,
      date,
      time,
      people,
      agreeToTerms,
    });

    // Save the reservation to the database
    await newReservation.save();

    res.status(201).json({ message: "Reservation confirmed!", reservation: newReservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Failed to submit reservation. Please try again." });
  }
};