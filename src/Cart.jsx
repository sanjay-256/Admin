import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import to get the passed state

const Cart = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]); // Initialize state as an empty array

  useEffect(() => {
    // Set cartItems from location state when the component mounts
    if (location.state?.cartItems) {
      setCartItems(location.state.cartItems);
    }
  }, [location.state]); // Re-run this effect if location.state changes

  const total = cartItems.reduce((acc, item) => acc + item.amount * item.count, 0);

  const increaseCount = (id) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, count: item.count + 1 } : item
    );
    setCartItems(updatedItems); // Update state
  };

  const decreaseCount = (id) => {
    const updatedItems = cartItems.map(item =>
      item.id === id && item.count > 1 ? { ...item, count: item.count - 1 } : item
    );
    setCartItems(updatedItems); // Update state
  };

  const placeOrder = async () => {
    const payload = {
      items: cartItems,
      total,
    };

    try {
      const response = await fetch('https://your-firebase-endpoint.com/UserData.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Order placed successfully');
        setCartItems([]); // Optionally clear the cart
      } else {
        alert('Error placing order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing your order');
    }
  };

  if (cartItems.length === 0) {
    return <p>No items in the cart.</p>;
  }

  return (
    <div>
      <div className='d-flex flex-wrap gap-5 px-5 py-3 justify-content-between container '>
        {cartItems.map(item => (
          <div key={item.id} className="border border-2 border-danger rounded p-2 text-center" style={{ width: '15rem' }}>
            <p className='fs-4 fw-semibold text-capitalize'>{item.name}</p>
            <p className='fs-5 fw-medium'>Rate: ₹{item.amount}</p>
            <p className='fs-5 fw-medium'>Quantity: {item.count}</p>
            <div className='d-flex justify-content-evenly'> 
              <button className='btn btn-outline-danger border-2 fw-bold' onClick={() => decreaseCount(item.id)}>–</button>
              <button className='btn btn-outline-success border-2 fw-bold' onClick={() => increaseCount(item.id)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <h3>Total: ₹{total}</h3>
      <button className="btn btn-success" onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Cart;
