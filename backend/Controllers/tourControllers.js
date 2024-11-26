import Tour from '../models/Tour.js';

export const createTour = async (req, res) => {
  console.log("in create tour",req.body);
  const newTour = new Tour(req.body);

  try {
    const savedTour = await newTour.save();
    res.status(200).json({ success: true, message: 'Successfully created', data: savedTour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create. Try again!' });
  }
};


export const updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json({ success: true, message: 'Successfully updated', data: updatedTour });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
};


export const deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Successfully deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
};


export const getSingleTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id).populate('reviews');
    res.status(200).json({ success: true, message: 'Successfully retrieved', data: tour });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found' });
  }
};


export const getAllTour = async (req, res) => {
  const page = parseInt(req.query.page) || 0;

  try {
    const tours = await Tour.find({})
      .populate('reviews')
      .skip(page * 8)
      .limit(8);

    res.status(200).json({ success: true, count: tours.length, message: 'Successfully retrieved', data: tours });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found' });
  }
};


export const getTourBySearch = async (req, res) => {
  const city = new RegExp(req.query.city, 'i');
  const days = parseInt(req.query.days) || 0;
  const maxGroupSize = parseInt(req.query.maxGroupSize) || 0;
  const fiveStarHotel = parseInt(req.query.fiveStarHotel) || 0;
  const threeStarHotel = parseInt(req.query.threeStarHotel) || 0;
  const economyFlight = parseInt(req.query.economyFlight) || 0;
  const businessFlight = parseInt(req.query.businessFlight) || 0;

  try {
    const tours = await Tour.find({
      city,
      days: { $gte: days },
      maxGroupSize: { $gte: maxGroupSize },
      'hotelOptions.fiveStar': { $gte: fiveStarHotel },
      'hotelOptions.threeStar': { $gte: threeStarHotel },
      'flightOptions.economy': { $gte: economyFlight },
      'flightOptions.business': { $gte: businessFlight },
    }).populate('reviews');

    res.status(200).json({ success: true, message: 'Successfully retrieved', data: tours });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found' });
  }
};

// Get featured Tours
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true }).populate('reviews').limit(8);
    res.status(200).json({ success: true, message: 'Successfully retrieved', data: tours });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Not Found' });
  }
};

// Get tour count
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({ success: true, data: tourCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
};
