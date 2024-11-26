import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom'; 
import { BASE_URL } from '../../utils/config';
const CheckoutForm = ({ totalAmount, booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert('Stripe has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error.message);
      alert(error.message);
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(`${BASE_URL}/booking/payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount  }), // Convert to cents
      });
      console.log("request called");
      

      const { clientSecret } = await response.json();

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error(confirmError.message);
        throw new Error(confirmError.message);
      }


      if (paymentIntent.status === 'succeeded') {
        console.log("inside booking if")

        await fetch(`${BASE_URL}/booking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...booking,
            paymentIntentId: paymentIntent.id,
          }),
        });
        alert('Booking confirmed!');
        navigate('/thank-you'); 

      }
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement  options={{
    style: {
      base: {
        color: '#424770', // Text color
        fontFamily: 'Arial, sans-serif', // Font family
        fontSize: '16px', // Font size
        '::placeholder': {
          color: '#aab7c4', // Placeholder text color
        },
      },
      invalid: {
        color: '#9e2146', // Text color for invalid input
      },
    },
  }}  />
      <button type="submit" disabled={processing || !stripe}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};
export default CheckoutForm;