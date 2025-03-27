const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/StripePaymentController');

// Create a payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Process successful payment
router.post('/payment-success', paymentController.processPaymentSuccess);

// Handle Stripe webhook events
// Note: This needs raw body parsing, so it should be configured differently in server.js
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;