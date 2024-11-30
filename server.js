require('dotenv').config();
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

app.use(cors({
    origin: process.env.CLIENT_URL, // Your frontend URL
    methods: ['POST'],
}));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, metadata } = req.body;

        // Validate inputs
        if (!priceId) {
            return res.status(400).json({ error: 'Price ID is required.' });
        }

        // Create Checkout Session for subscription
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/pricing.html`,
            metadata: {
                ...metadata,
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(4242, () => console.log('Server running on port 4242'));
