import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    days: {
      type: Number, 
      required: true,
    },
    photo: {
      type: String,
      required: [true, 'Photo URL is required'],
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },

    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

    hotelOptions: {
      fiveStar: {
        type: Number,
        required: [true, '5-star hotel price is required'],
        default: 0 
      },
      threeStar: {
        type: Number,
        required: [true, '3-star hotel price is required'],
        default: 0
      },
    },

    flightOptions: {
      economy: {
        type: Number,
        required: [true, 'Economy flight price is required'],
        default: 0
      },
      business: {
        type: Number,
        required: [true, 'Business class flight price is required'],
        default: 0
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
