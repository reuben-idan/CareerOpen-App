const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../user/userModel');
const Order = require('./orderModel');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires the amount in cents
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method_types: ['card']
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error });
  }
};

exports.handleWebhookEvent = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log(`PaymentMethod ${paymentMethod.id} was attached to customer ${paymentMethod.customer}`);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Error handling webhook event', error });
  }
};

// Other payment-related controller functions...