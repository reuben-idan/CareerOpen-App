const express = require('express');
const paymentController = require('./paymentController');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Create a payment intent
router.post('/create-payment-intent', authMiddleware.authenticate, paymentController.createPaymentIntent);

// Handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhookEvent);

// Other payment-related routes...

module.exports = router;