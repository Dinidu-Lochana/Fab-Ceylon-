const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/FoodOrderModel");

// Create a payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
      currency: 'lkr', // Sri Lankan Rupees
      metadata: {
        orderId: orderId || 'pending_order' // Store orderId in metadata for reference
      }
    });

    // Return the client secret
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};

// Process a successful payment
exports.processPaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Verify that the payment intent exists and is successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment has not been completed successfully' });
    }

    // Update the order with payment info
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        stripePaymentIntentId: paymentIntentId,
        paymentStatus: 'Completed'
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ error: error.message });
  }
};

// Handle webhook events from Stripe
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      
      // If order ID is in metadata, update the order
      if (paymentIntent.metadata && paymentIntent.metadata.orderId && paymentIntent.metadata.orderId !== 'pending_order') {
        try {
          await Order.findByIdAndUpdate(
            paymentIntent.metadata.orderId,
            {
              stripePaymentIntentId: paymentIntent.id,
              paymentStatus: 'Completed'
            }
          );
        } catch (error) {
          console.error('Error updating order after payment success:', error);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log('Payment failed:', failedPaymentIntent.id);
      
      // Update order status if order ID is available
      if (failedPaymentIntent.metadata && failedPaymentIntent.metadata.orderId && failedPaymentIntent.metadata.orderId !== 'pending_order') {
        try {
          await Order.findByIdAndUpdate(
            failedPaymentIntent.metadata.orderId,
            {
              stripePaymentIntentId: failedPaymentIntent.id,
              paymentStatus: 'Failed'
            }
          );
        } catch (error) {
          console.error('Error updating order after payment failure:', error);
        }
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};