import React,{useEffect,useState} from "react";
import axios from '../../configurations/axios'
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { CogIcon, UserIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";
import UserSettings from "../../components/defaultMulti-Components/UserSettings"
import {Alert} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
export function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showerrorMessage, setShowerrorMessage] = useState(false);
  const Navigate = useNavigate()
  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
    }
  };
  const handleOrderConfirmation = async () => {
    try {
      if (cartItems.length === 0) {
        setShowerrorMessage(true);
        return;
      }
  
      // Step 1: Create the order in the database
      const orderResponse = await axios.post("/insertNewOrder", {
        cartItems: cartItems // Send the cartItems array to the server
      });
  
      // Clear the cart items from localStorage or perform other actions as needed
      localStorage.removeItem("cartItems");
  
      // Redirect to the order confirmation page or show a success message
      // Replace "confirmation-page" with the path to your order confirmation page
      // You can use React Router to navigate to the confirmation page
      // history.push("/confirmation-page");
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error creating order:", error);
      // Handle errors and show error messages if necessary
      setShowerrorMessage(true);
    }
    setTimeout(() => {
      Navigate("/");
    }, 3000);
  };
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');

  useEffect(() => {
    // Fetch payment information for the user
    getPaymentInformation();
  }, []);

  const getPaymentInformation = async () => {
    try {
      const response = await axios.get('/getPaymentInfo');
      setPaymentInfo(response.data);
    } catch (error) {
      console.error('Error occurred while fetching payment information:', error);
    }
  };

  // Function to check if all inputs are filled
  const areInputsFilled = () => {
    return address.trim() !== "" && postalCode.trim() !== "";
  };


  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from localStorage when the component mounts
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);
  const calculateSubtotal = (item) => {
    return item.quantity * item.price;
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateSubtotal(item), 0);
  };
  
  return (
    <div className="w-full px-24 py-4 m-6">

      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => setActiveStep(0)}>
          <UserIcon className="h-5 w-5" />
          <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 0 ? "blue" : "blue-gray"}>
              Step 1
            </Typography>
            <Typography color={activeStep === 0 ? "blue" : "gray"} className="font-normal">
              Confirm Cart
            </Typography>
          </div>
        </Step>
        <Step onClick={() => setActiveStep(1)}>
          <CogIcon className="h-5 w-5" />
          <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 1 ? "blue" : "blue-gray"}>
              Step 2
            </Typography>
            <Typography color={activeStep === 1 ? "blue" : "gray"} className="font-normal">
              Choose the Payment Card
            </Typography>
          </div>
        </Step>
        <Step onClick={() => setActiveStep(2)}>
          <BuildingLibraryIcon className="h-5 w-5" />
          <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 2 ? "blue" : "blue-gray"}>
              Step 3
            </Typography>
            <Typography color={activeStep === 2 ? "blue" : "gray"} className="font-normal">
              Confirm Order
            </Typography>
          </div>
        </Step>
      </Stepper>
      {activeStep === 0 && (
        <div className="mt-24">
    {cartItems.length > 0 ? 
          <>
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center gap-5 border-b-1 border-color dark:border-gray-600 p-4">
          {/* Replace these dummy values with actual properties from your cartData */}
          {item.image_url ? (
                <img
                  className="rounded-lg h-80 w-24"
                  src={item.image_url == null
                    ? "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    : item.image_url} // Use the image URL directly
                  alt=""
                />
              ) : (
                <img
                  className="rounded-lg h-80 w-24"
                  src={`/image/${item.game_id}`} // Fetch from Express.js backend
                  alt=""
                />
              )}   
              <div>
                {/* Replace "gameid" */}
                <p className="font-semibold">{`Game ID: ${item.game_id}`}</p>
                {/* Replace "quantity" */}
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{`Quantity: ${item.quantity}`}</p>
                <div className="flex gap-4 mt-2 items-center">
                  {/* Replace "price" */}
                  <p className="font-semibold text-lg">{`Price: ${item.price}`}</p>
                </div>
              </div>              <div>
                <p className="font-semibold">{`Subtotal: ${calculateSubtotal(item)} SGD`}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <p className="font-semibold">Total:</p>
            <p className="font-semibold">{`${calculateTotal()} SGD`}</p>
          </div>
        </>: (<p>Cart Is Empty...</p>)}
        </div>
      )}
      {activeStep===1 && (
        <div className="mt-24">
                  <UserSettings selection={true}/>  
        </div>
      )}

      {/* Check out & Confirm Order Step */}
      {activeStep === 2 && (
  <div className="mt-24 w-80 mx-auto">
    <div className="mb-4">
      <h2 className="font-medium mb-1 text-gray-800">Payment Information:</h2>
      {paymentInfo.length > 0 ? (
        <div className="flex flex-col mb-2">
          {paymentInfo.map((payment) => (
            <label key={payment.paymentID} className="flex items-center mb-2">
              <input
                type="radio"
                name="paymentType"
                value={payment.paymentType}
                checked={selectedPaymentType === payment.paymentType}
                onChange={(e) => setSelectedPaymentType(e.target.value)}
              />
              <span className="font-medium ml-2">{payment.paymentType}</span>
              <span className="ml-2 text-gray-600">Ending in {payment.LastDigits}</span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-red-600">No payment information available</p>
      )}
    </div>
    <div className="mb-4">
      <label htmlFor="address" className="block font-medium mb-1 text-gray-800">
        Address:
      </label>
      <input
        type="text"
        id="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
        placeholder="Enter your address"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="postalCode" className="block font-medium mb-1 text-gray-800">
        Postal Code:
      </label>
      <input
        type="text"
        id="postalCode"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
        placeholder="Enter your postal code"
      />
    </div>
    <Button
      onClick={handleOrderConfirmation}
      disabled={!address || !postalCode || !selectedPaymentType}
      className={`w-full ${
        !address || !postalCode || !selectedPaymentType
          ? "bg-blue-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white font-semibold py-2 px-4 rounded disabled:opacity-50`}
    >
      Confirm Order
    </Button>
  </div>
)}
      <div className="mt-32 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div><div className="m-5">
      {showSuccessMessage && (
        <div className="d">
                  <Alert color="green" outlined>
          Order Confirmed
        </Alert>
        </div>
      )}
      {showerrorMessage && (
        <Alert color="red" outlined>
          Unable to place order, try again later
        </Alert>
      )}
      </div>
    </div>
  );
}


export default Checkout
