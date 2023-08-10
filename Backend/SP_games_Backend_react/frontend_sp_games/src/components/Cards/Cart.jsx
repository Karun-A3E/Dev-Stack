import React, {useState,useEffect} from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { Button, IconButton } from '@material-tailwind/react';
import UserConfirmBox from '../Forms/UserConfirmBox';
const Cart = () => {
  const { currentColor, handleClick, setIsClicked, isClicked } = useStateContext();
  const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control the visibility of the confirmation dialog
  const [confirmationIndex, setConfirmationIndex] = useState(null);
  const CloseCart = () => {
    setIsClicked((prev) => ({
      ...prev,
      cart: false,
    }));
  };
  const navigate = useNavigate();


  const handleQuantityChange = (index, action) => {
    setCartData((prevData) => {
      const updatedData = [...prevData];
      const currentItem = updatedData[index];
  
      if (action === 'increment') {
        currentItem.quantity++;
      } else if (action === 'decrement') {
        if (currentItem.quantity > 1) {
          currentItem.quantity--;
        } else {
          // If quantity is 1 and decrement is clicked, show the confirmation dialog
          setConfirmationIndex(index);
          setShowConfirmation(true);
        }
      }
  
      // Remove the item from the cart if the quantity becomes 0 after decrementing
      if (currentItem.quantity === 0) {
        updatedData.splice(index, 1);
      }
  
      return updatedData;
    });
  };
  


  const handleConfirmationCancel = () => {
    setShowConfirmation(false);
    setConfirmationIndex(null);
  };
  const handleConfirmationConfirm = () => {
    // Remove the item from the cartData array
    setShowConfirmation(false);
    if (confirmationIndex !== null) {
      setCartData((prevData) => {
        const updatedData = [...prevData];
        updatedData.splice(confirmationIndex, 1);
        return updatedData;
      });
      setConfirmationIndex(null);
  
      // Update the local storage to reflect the new cart items after removal
      localStorage.setItem('cartItems', JSON.stringify(cartData));
    }
  };
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Calculate the total price whenever the cart items change
    let total = 0;
    cartData.forEach((item) => {
      total += parseFloat(item.price) * item.quantity;
    });
    setTotalPrice(total);
  }, [cartData]);



  React.useEffect(() => {
    // Save updated cart data to localStorage whenever cartData changes
    localStorage.setItem('cartItems', JSON.stringify(cartData));
  }, [cartData]);

  return (
    <div className="w-full fixed nav-item top-12 right-3 bottom-11">
      <div className="float-right h-20vh duration-1000 ease-in-out dark:text-gray-200 transition-all dark:bg-[#484B52] bg-white/60 backdrop-blur-xl md:w-400 p-8 rounded-l-xl">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">Shopping Cart</p>
          <IconButton onClick={CloseCart} variant='text' size='lg' className='rounded-full text-blue-gray-500 hover:text-black bg-none'>
            <MdOutlineCancel />
          </IconButton>
        </div>
        {cartData?.map((item, index) => (
        <div key={index}>
          <div>
            <div className="flex items-center leading-8 gap-5 border-b-1 border-color dark:border-gray-600 p-4">
              {/* Replace these dummy values with actual properties from your cartData */}
              {item.image_url ? (
                <img
                  className="rounded-lg h-80 w-24"
                  src={item.image_url} // Use the image URL directly
                  alt=""
                />
              ) : (
                <img
                  className="rounded-lg h-80 w-24"
                  src={`/image/${item.game_id}`} // Fetch from Express.js backend
                  alt=""
                />
              )}              <div>
                {/* Replace "gameid" with the actual property name for the game title */}
                <p className="font-semibold ">{`Game ID: ${item.game_id}`}</p>
                {/* Replace "quantity" with the actual property name for the quantity */}
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{`Quantity: ${item.quantity}`}</p>
                <div className="flex gap-4 mt-2 items-center">
                  {/* Replace "price" with the actual property name for the price */}
                  <p className="font-semibold text-lg">{`Price: ${item.price}`}</p>
                  <div className="flex items-center  rounded">
                  <IconButton color='red' variant='text'
                      className="p-2  text-red-600 rounded-full"
                      onClick={() => handleQuantityChange(index, 'decrement')}
                    >
                      <AiOutlineMinus />
                    </IconButton>
                    <p className="p-2 dark:border-gray-600 text-black-600">{item.quantity}</p>
                    <IconButton color='green'variant='text'
                      className="p-2  text-green-600 rounded-full"
                      onClick={() => handleQuantityChange(index, 'increment')}
                    >
                      <AiOutlinePlus />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="m-5">
      {showConfirmation && (
        <UserConfirmBox
          message="Do you want to remove this item from the cart?"
          onConfirm={handleConfirmationConfirm}
          onCancel={handleConfirmationCancel}
        />
      )}
      </div>

        <div className="mt-3 mb-3">
        <div className="mt-3 mb-3">
        <div className="flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-200">Sub Total</p>
          <p className="font-semibold">${totalPrice}</p>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-gray-500 dark:text-gray-200">Total</p>
          <p className="font-semibold">${totalPrice}</p>
        </div>
      </div>
        </div>
        <div className="mt-5">
  <Button
    color="blue"
    bgColor={currentColor}
    text="Place Order"
    borderRadius="10px"
    width="full"
    onClick={() => {
      CloseCart();
      navigate('/Checkout');
    }}
  >
    Check out
  </Button>
</div>

      </div>
    </div>
  );
};

export default Cart