import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    bookAt: {
      type: Date,
      required: true,
    },
    hotelType: {
      type: String,
      enum: ['fiveStar', 'threeStar'],
      default: 'fiveStar',
    },
    flightClass: {
      type: String,
      enum: ['economy', 'business'],
      default: 'economy',
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
