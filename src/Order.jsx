import React, { useState, useEffect } from 'react';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router

const Order = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate(); // For navigation to the Cart page

  useEffect(() => {
    const db = getDatabase();
    const itemsRef = dbRef(db, 'items');

    const unsubscribeItems = onValue(itemsRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      const itemsList = data
        ? Object.keys(data).map(key => ({ id: key, ...data[key], count: 1 }))
        : [];
      setItems(itemsList);
    }, (error) => {
      setLoading(false);
      setError('Failed to fetch items.');
    });

    return () => {
      unsubscribeItems();
    };
  }, []);

  const increaseCount = (item) => {
    setCartItems(prevCartItems => {
      return prevCartItems.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, count: cartItem.count + 1 } : cartItem
      );
    });
  };

  const decreaseCount = (item) => {
    setCartItems(prevCartItems => {
      return prevCartItems.map(cartItem => 
        cartItem.id === item.id && cartItem.count > 1 ? { ...cartItem, count: cartItem.count - 1 } : cartItem
      );
    });
  };

  const addToCart = (item) => {
    setCartItems(prevCartItems => {
      const exists = prevCartItems.find(cartItem => cartItem.id === item.id);
      if (exists) {
        return prevCartItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, count: cartItem.count + 1 } : cartItem
        );
      }
      return [...prevCartItems, { ...item, count: 1 }]; // Always start with count 1 when adding new items
    });
  };

  const removeFromCart = (item) => {
    setCartItems(prevCartItems => prevCartItems.filter(cartItem => cartItem.id !== item.id));
  };

  const submitCart = async () => {
    setSubmitting(true); // Set submitting state to true
    const total = cartItems.reduce((acc, item) => acc + item.amount * item.count, 0);
    const payload = {
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            rate: item.amount, // Ensure you're sending the correct amount here
            count: item.count,
          })),
          total,
    };

    try {
      const response = await fetch('https://place-order-36d51-default-rtdb.firebaseio.com/UserData.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Order placed successfully');
        setCartItems([]); // Clear cart after submitting
      } else {
        throw new Error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.message || 'An error occurred while placing your order');
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.amount * item.count || 0), 0);
  };

  const isItemInCart = (itemId) => {
    return cartItems.some(cartItem => cartItem.id === itemId);
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className='text-end p-3'>
        <div className="dropdown-center">
          <button
            className="btn btn-outline-dark dropdown-toggle fw-medium text-capitalize"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={(e) => e.preventDefault()} // Prevent form submission on button click
          >
            {category || "Select a category"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a className="dropdown-item" onClick={() => setCategory('breakfast')}>Breakfast</a></li>
            <li><a className="dropdown-item" onClick={() => setCategory('lunch')}>Lunch</a></li>
            <li><a className="dropdown-item" onClick={() => setCategory('snack')}>Snack</a></li>
            <li><a className="dropdown-item" onClick={() => setCategory('dinner')}>Dinner</a></li>
          </ul>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-5 px-5 py-3 justify-content-between container">
        {items.filter(item => !category || item.category === category).map(item => (
          <div key={item.id} className='border border-2 border-danger rounded' style={{ width: '15rem' }}>
            <div className='m-2 text-center border rounded p-1' style={{ height: '150px' }}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className='img-fluid rounded' style={{ height: '100%' }} />
              )}
            </div>

            <div className='ms-3 '>
              <p className='fw-medium fs-5'>{item.name}</p>
              <p className='fw-medium'>Rate: ₹{item.amount}</p>

              <div className='d-flex justify-content-evenly my-3'>
                <button className='btn btn-outline-danger border-2 fw-bold' onClick={() => decreaseCount(item)}>–</button>
                <span className='fs-5 fw-medium'>{isItemInCart(item.id) ? cartItems.find(cartItem => cartItem.id === item.id).count : item.count}</span>
                <button className='btn btn-outline-success border-2 fw-bold' onClick={() => increaseCount(item)}>+</button>
              </div>

              <div className='p-2 text-center'>
                {isItemInCart(item.id) ? (
                  <button className='btn btn-danger' onClick={() => removeFromCart(item)}>
                    Remove from cart
                  </button>
                ) : (
                  <button className='btn btn-dark' onClick={() => addToCart(item)}>
                    Add to cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='text-center mb-5'>
        <h3>Total: ₹{calculateTotal()}</h3>
        <button className='btn btn-success mt-4' onClick={submitCart} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Cart'}
        </button>
      </div>
    </div>
  );
};

export default Order;
