import React, { useState, useContext, useEffect } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { BASE_URL, STRIPE_PUBLIC_KEY } from '../../utils/config';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const Booking = ({ tour, avgRating }) => {
  const { price, reviews = [], title, hotelOptions = {}, flightOptions = {} } = tour;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState({
    userId: user?._id || '',
    userEmail: user?.email || '',
    tourName: title || '',
    fullName: '',
    phone: '',
    guestSize: 1,
    bookAt: '',
    hotelType: 'fiveStar',
    flightClass: 'economy',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const serviceFee = 10;
  useEffect(() => {
    const hotelPrice = booking.hotelType === 'fiveStar' ? hotelOptions.fiveStar || 0 : hotelOptions.threeStar || 0;
    const flightPrice = booking.flightClass === 'economy' ? flightOptions.economy || 0 : flightOptions.business || 0;
    const calculatedTotal = Number(price) * Number(booking.guestSize) + hotelPrice + flightPrice + serviceFee;

    setTotalAmount(calculatedTotal);
  }, [booking, hotelOptions, flightOptions, price]);

  const handlePaymentClick = () => {
    if (!user) {
      alert('Please sign in');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="booking">
      {!showCheckout ? (
        <>
          <div className="booking__top d-flex align-items-center justify-content-between">
            <h3>
              ${price} <span>/per person</span>
            </h3>
            <span className="tour__rating d-flex align-items-center">
              <i className="ri-star-fill" style={{ color: 'var(--secondary-color)' }}></i>
              {avgRating ? avgRating : 'N/A'} ({reviews.length})
            </span>
          </div>
          <div className="booking__form">
            <h5>Information</h5>
            <Form>
              <FormGroup>
                <input type="text" placeholder="Full Name" id="fullName" required onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <input type="tel" placeholder="Phone" id="phone" required onChange={handleChange} />
              </FormGroup>
              <FormGroup className="d-flex align-items-center gap-3">
                <input type="date" id="bookAt" required onChange={handleChange} />
                <input type="number" placeholder="Guests" id="guestSize" required onChange={handleChange} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="hotelType">Hotel Type</label>
                <select id="hotelType" value={booking.hotelType} onChange={handleChange}>
                  <option value="fiveStar">5 Star - ${hotelOptions.fiveStar || 0}</option>
                  <option value="threeStar">3 Star - ${hotelOptions.threeStar || 0}</option>
                </select>
              </FormGroup>
              <FormGroup>
                <label htmlFor="flightClass">Flight Class</label>
                <select id="flightClass" value={booking.flightClass} onChange={handleChange}>
                  <option value="economy">Economy - ${flightOptions.economy || 0}</option>
                  <option value="business">Business - ${flightOptions.business || 0}</option>
                </select>
              </FormGroup>
            </Form>
          </div>
          <div className="booking__bottom">
            <ListGroup>
              <ListGroupItem className="border-0 px-0">
                <h5>
                  ${price} <i className="ri-close-line"></i> {booking.guestSize} person(s)
                </h5>
                <span>${price * booking.guestSize}</span>
              </ListGroupItem>
              <ListGroupItem className="border-0 px-0">
                <h5>Service charge</h5>
                <span>${serviceFee}</span>
              </ListGroupItem>
              <ListGroupItem className="border-0 px-0 total">
                <h5>Total</h5>
                <span>${totalAmount}</span>
              </ListGroupItem>
            </ListGroup>
            <Button className="btn primary__btn w-100 mt-4" onClick={handlePaymentClick}>
              Proceed to Payment
            </Button>
          </div>
        </>
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutForm totalAmount={totalAmount} booking={booking} />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
