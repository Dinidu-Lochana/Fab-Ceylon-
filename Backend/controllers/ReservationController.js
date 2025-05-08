// controllers/ReservationController.js
const nodemailer = require("nodemailer");
const Reservation = require("../models/ReservationModel");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'colby.schoen@ethereal.email',
      pass: 'fh78D4cE5mwdyRExJA'
  }
});
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

    // Prepare email options
    const mailOptions = {
      from: "colby.schoen@ethereal.email", // sender address
      to: "jiltone0@gmail.com", // list of receivers
      subject: "Reservation Confirmed", // Subject line
      text: `Your reservation at ${cafe} has been confirmed for ${people} people on ${date} at ${time}.`, // plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send confirmation email." });
      }
      console.log("Email sent: " + info.response);
    });

    res.status(201).json({ message: "Reservation confirmed!", reservation: newReservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Failed to submit reservation. Please try again." });
  }
};

exports.getAllReservation = async (req, res) => {
  try {
    const recervationData = await Reservation.find();

    if(!recervationData){
      res.status(400).json({code:400,message:'there are no recervations'});
    }
    console.log(recervationData);

    res.status(200).json({code:200, message:'all reservation', data:recervationData});
  }catch(error){
    console.error(error);
    res.status(500).json({code:500, message:'cant get all reservation'});
  }
}