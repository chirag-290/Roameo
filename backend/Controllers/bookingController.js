import Booking from '../models/Booking.js';
import { verifyToken } from '../utils/verifyToken.js';
import Stripe from 'stripe';


const stripe = new Stripe("sk_test_51QOv8nJnUcBaqM6WAVOSICHN5Uu64V6I6LJeCJWM7gnTyrP8VBzSQliYdt0RtwmxaV1Rg2ehakUWFag6dmtTlOiq00OC3RcVGS");



export const createBooking = async (req, res) => {
  const { id } = req.params; 
  const { amount, ...bookingDetails } = req.body;

  try {
    // Step 3: Save the booking details locally
    const newBooking = new Booking({ ...bookingDetails}); 
    await newBooking.save();
    // console.log(newBooking);
    res.status(200).json({
      message:"sucess",
      newBooking
    })
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ success: false, message: 'Internal server error!' });
  }
};

export const getBooking = async (req, res) => {
  verifyToken(req, res, async () => {
    const id = req.params.id;

    try {
      const booking = await Booking.findById(id);

      if (booking && booking.userId === req.user.id) {
        res.status(200).json({ success: true, message: 'Successful!', data: booking });
      } else {
        res.status(404).json({ success: false, message: 'Booking not found or unauthorized access!' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error!' });
    }
  });
};

// Get all bookings for the authenticated user
export const getAllBooking = async (req, res) => {
  verifyToken(req, res, async () => {
    try {
      const bookings = await Booking.find({ userId: req.user.id });
      res.status(200).json({ success: true, message: 'Successful!', data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error!' });
    }
  });
};

export const getstripeasync =async(req, res) => {
  let { amount } = req.body;


  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency: 'usd', 
      payment_method_types: ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};