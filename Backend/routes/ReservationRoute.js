// routes/ReservationRoute.js
const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/ReservationController");

// POST route to create a reservation
router.post("/reservations", reservationController.createReservation);
router.get("/getall/reservations", reservationController.getAllReservation);

module.exports = router;