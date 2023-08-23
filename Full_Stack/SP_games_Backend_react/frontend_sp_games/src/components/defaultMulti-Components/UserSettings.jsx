import React, { useEffect, useState } from 'react';
import axios from '../../configurations/axios';

import { Typography, Button } from '@material-tailwind/react';
import GooglePay from './CreditCard/GooglePay';
import MasterCard from './CreditCard/MasterCard';
import Visa from './CreditCard/Visa';
import Paypal from './CreditCard/Paypal';
import AddPayment from '../Forms/AddPayment';

const UserSettings = ({ selection = false }) => {
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false); // State to control the visibility of AddPayment dialog
  const [selectedCard, setSelectedCard] = useState(null); // State to keep track of the selected card

  useEffect(() => {
    // Fetch user data from the API
    const fetchPayment = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/getPaymentInfo"
        );
        setPaymentDetails(response.data); // Assuming the API response contains an array of order details
        setLoading(false); // Data fetching is done, set loading state to false
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false); // Set loading state to false even in case of an error
      }
    };

    fetchPayment();
  }, []);

  if (loading) {
    // Show a loading message while data is being fetched
    return <Typography color="blue-gray">Loading order details...</Typography>;
  }

  const handleAddCardClick = () => {
    // Open the AddPayment dialog when the "Add Card" button is clicked
    setIsAddPaymentOpen(true);
  };

  const handleAddPaymentClose = () => {
    // Close the AddPayment dialog when the dialog is closed or canceled
    setIsAddPaymentOpen(false);
  };

  const handleCardSelection = (paymentType) => {
    setSelectedCard(paymentType);
  };

  const renderCard = (paymentType, lastDigits) => {
    switch (paymentType) {
      case "Visa":
        return <Visa lastDigits={lastDigits} />;
      case "Mastercard":
        return <MasterCard lastDigits={lastDigits} />;
      case "GooglePay":
        return <GooglePay lastDigits={lastDigits} />;
      case "PayPal":
        return <Paypal lastDigits={lastDigits} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      {/* Left Column: Render payment cards */}
      <div className="flex flex-col space-y-4">
        {paymentDetails.map((payment, index) => (
          <div key={index} className="flex space-x-4">
            {/* Render card components */}
            <div>{renderCard(payment.paymentType, payment.LastDigits)}</div>

            {/* Render radio button for card selection if `selection` prop is true */}
            {selection && (
              <input
                type="radio"
                name="selectedCard"
                value={payment.paymentType}
                checked={selectedCard === payment.paymentType}
                onChange={() => handleCardSelection(payment.paymentType)}
              />
            )}
          </div>
        ))}
        <div className="mt-24 py-5">
          {/* "Add Card" button */}
          <Button color="blue" onClick={handleAddCardClick} className="mt-">
            + Add Card
          </Button>
        </div>
      </div>
      {/* Render AddPayment component in a dialog */}
      {isAddPaymentOpen && <AddPayment onClose={handleAddPaymentClose} />}
    </div>
  );
};

export default UserSettings;
