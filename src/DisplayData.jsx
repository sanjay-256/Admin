import React, { useEffect, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from './firebaseConfig'; // Adjust path if necessary

const DisplayData = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ordersRef = ref(database, 'UserData');

    const handleDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setOrders(formattedData);
        setLoading(false);
      } else {
        console.log('No data available');
        setOrders([]);
        setLoading(false);
      }
    };

    const handleError = (error) => {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    };

    // Attach the listener for real-time updates
    const unsubscribe = onValue(ordersRef, handleDataChange, handleError);

    // Clean up the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const deleteOrder = async (orderId) => {
    const orderRef = ref(database, `UserData/${orderId}`);

    try {
      await remove(orderRef);
      console.log(`Order with ID ${orderId} has been deleted.`);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <>
     <div className="container-fluid bg-warning-subtle">
     <div className="container d-flex flex-wrap column-gap-4 row-gap-5 justify-content-center py-5">
      {orders.length === 0 ? (
        <p className='p-5'>No orders found.</p>
      ) : (
        orders.map(order => (
          <div className="card border-2 border-dark" key={order.id} style={{ width: '25rem' }}>
            <div className="card-top p-2 fw-medium">Items:</div>
            <div className="card-body bg-info-subtle">
              <ul className="">
                {order.items.map((item, index) => (
                  <li className="list-unstyled" key={index}>
                    <p className="fw-semibold fs-5"> 
                      <span className="fs-6">{item.name}</span>: {item.count} x ₹{item.rate}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
              <div className="card-footer bg-white text-center">
                <p className="card-text fw-bold my-auto fs-5 d-inline">Total: ₹{order.total}</p>
                <button
                  className="btn btn-danger float-end"
                  onClick={() => deleteOrder(order.id)}>
                  Delete
                </button>
              </div>
          </div>
        ))
      )}
    </div>
     </div>
    </>
  );
};

export default DisplayData;
