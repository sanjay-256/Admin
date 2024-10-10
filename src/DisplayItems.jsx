import React, { useState, useEffect } from 'react';
import { getDatabase, ref as dbRef, onValue, set, remove } from 'firebase/database';

const DisplayItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [data, setData] = useState([]); // State to track items in cart
  const [category, setCategory] = useState('');

  useEffect(() => {
    const db = getDatabase();
    const itemsRef = dbRef(db, 'items');
    const cartRef = dbRef(db, 'cart'); // Reference to the cart in the database

    const unsubscribeItems = onValue(itemsRef, (snapshot) => {
      setLoading(false); // Data is now being fetched
      const data = snapshot.val();
      const itemsList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setItems(itemsList);
    }, (error) => {
      setLoading(false);
      setError('Failed to fetch items.'); // Handle errors
      console.error('Error fetching data:', error);
    });

    const unsubscribeCart = onValue(cartRef, (snapshot) => {
      const cartData = snapshot.val();
      const cartList = cartData ? Object.keys(cartData).map(key => cartData[key].id) : []; // Get cart item IDs
      setData(cartList); // Set cart items in state
    }, (error) => {
      console.error('Error fetching cart data:', error);
    });

    return () => {
      unsubscribeItems(); // Cleanup the listener for items
      unsubscribeCart(); // Cleanup the listener for cart
    };
  }, []);

  const submit = (item) => {
    const db = getDatabase();
    const itemRef = dbRef(db, `cart/${item.id}`); // Reference to the specific item in the cart
    set(itemRef, { ...item }) // Add item to cart in Firebase
      .then(() => {
        setData(prev => [...prev, item.id]); // Update local state for immediate UI update
      })
      .catch((error) => {
        console.error('Error adding item to cart:', error);
      });
  };

  const removeItem = (item) => {
    const db = getDatabase();
    const itemRef = dbRef(db, `cart/${item.id}`); // Reference to the specific item in the cart
    remove(itemRef) // Remove item from cart in Firebase
      .then(() => {
        setData(prev => prev.filter(id => id !== item.id)); // Update local state for immediate UI update
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  if (loading) {
    return <p>Loading items...</p>; // Loading message
  }

  if (error) {
    return <p>{error}</p>; // Display error message
  }

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
      <div className='d-flex flex-wrap gap-5 px-5 py-3 justify-content-between container'>
      {items.length === 0 ? (
        <p>No items available.</p> // Message when no items
      ) : (
        items.filter(item => !category || item.category === category).map((item) => (
          <div key={item.id} className='border border-2 border-danger' style={{ width: '15rem' }}>
            <div className='m-2 text-center border rounded p-1' style={{ height: '150px' }}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className='img-fluid rounded' style={{ height: '100%' }} />
              )}
            </div>
            <div className='ms-3'>
              <p className='fw-medium fs-5'>Name: {item.name}</p>
              <div className='d-flex justify-content-between'>
                <p className='fw-medium'>Amount: ₹{item.amount}</p>
                <p className='fw-medium me-3'>Rating: {item.rating}</p>
              </div>
              <p className='fw-medium'>Category: {item.category}</p>
              <p className='fw-medium'>Description: {item.description}</p>
            </div>
            <div className="p-2 text-center">
              {data.includes(item.id) ? (
                <button className='btn btn-dark' onClick={() => removeItem(item)}>
                  <i className="bi bi-cart-plus pe-2 text-danger"></i>Remove from cart
                </button>
              ) : (
                <button className='btn btn-dark' onClick={() => submit(item)}>
                  <i className="bi bi-cart-plus pe-2 text-info"></i>Add to cart
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default DisplayItems;
