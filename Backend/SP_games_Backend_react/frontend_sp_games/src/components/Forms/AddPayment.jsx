import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making API calls
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from '@material-tailwind/react';

const AddPayment = ({ onClose }) => {
  const [cardType, setCardType] = useState('Visa');
  const [cardNumber, setCardNumber] = useState('');

  const handleCardTypeChange = (event) => {
    setCardType(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleAddCard = async () => {
    try {
      // Make the API call to add the new payment card
      const response = await axios.post('/addNewPaymentCard', {
        paymentType: cardType,
        lastDigits: cardNumber,
      });

      // Check if the card was successfully added
      if (response.status === 201) {
        console.log('Payment card added successfully');
        // Close the dialog after adding the card details
        onClose();
      } else {
        console.log('Failed to add payment card');
        // Handle the case where the card addition failed
      }
    } catch (error) {
      console.error('Error occurred while adding a new payment card:', error);
      // Handle any API call errors here
    }
  };

  return (
    <>
      <Dialog open={true} handler={onClose}>
        <DialogHeader>Add Payment</DialogHeader>
        <DialogBody>
          <div>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="visa"
                name="cardType"
                value="Visa"
                checked={cardType === 'Visa'}
                onChange={handleCardTypeChange}
              />
              <label htmlFor="visa" className="ml-2">Visa</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="mastercard"
                name="cardType"
                value="MasterCard"
                checked={cardType === 'MasterCard'}
                onChange={handleCardTypeChange}
              />
              <label htmlFor="mastercard" className="ml-2">MasterCard</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="googlepay"
                name="cardType"
                value="GooglePay"
                checked={cardType === 'GooglePay'}
                onChange={handleCardTypeChange}
              />
              <label htmlFor="googlepay" className="ml-2">GooglePay</label>
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="Enter Card Number"
                className="border w-full p-2 rounded"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={onClose}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleAddCard}>
            <span>Add Card</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddPayment;
