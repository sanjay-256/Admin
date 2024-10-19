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
  
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
  
    if (!confirmDelete) {
      console.log(`Deletion of order with ID ${orderId} was canceled.`);
      return; // Exit the function if the user cancels
    }
  
    try {
      await remove(orderRef);
      console.log(`Order with ID ${orderId} has been deleted.`);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err);
    }
  };

  const printBill = (order) => {
    const Date = formatDate(order.createdAt);
    const billContent = `
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
            crossorigin="anonymous"></script>
          <style>
            @media print {
              .btn-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="bill-content container p-3">
            <div class="text-center mb-3">
              <div class="d-flex gap-3 align-items-center justify-content-center">
                <img src="sub_logo.png" alt="Shop Logo" style="width: 80px;" class="">
                <h2 class="fw-bold">Kaimanam</h2>
              </div>
              <p class="mb-0 text-wrap" style="font-size: 13px;">12/9 Vadanoombal Salai, Parvathi Nagar, 2nd Street, Perumalagaram, Chennai, Tamil Nadu 600077</p>
              <div class="d-flex gap-3 align-items-center justify-content-center">
              <p>Phone_No: 1234567890</p><p class="fw-medium" style="font-size:13px;">${Date}</p>
              </div>
            </div>
  
            <div class="text-danger fs-4 fw-bold">
              <h4 class="fw-bold text-center text-capitalize">kaimanam home foods</h4>
            </div>
  
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.count}</td>
                    <td>₹${item.rate}</td>
                    <td>₹${item.rate * item.count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
  
            <div class="text-center fw-bold fs-5 mb-3">
              Total: ₹${order.total}
            </div>
  
            <div class="text-center">
              <p>********** Thank You **********</p>
            </div>
  
            <div class="text-center btn-print">
              <button onclick="window.print()" class="btn btn-primary">Print Bill</button>
            </div>
          </div>
        </body>
      </html>
    `;
  
    const newWindow = window.open('', '', 'width=400,height=600');
    newWindow.document.write(billContent);
    newWindow.document.close();
  };
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
                <div className="card-top p-2 fw-medium">
                  Items: <span className='float-end'> {formatDate(order.createdAt)}</span>
                </div>
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
                    className="btn btn-success float-end"
                    onClick={() => printBill(order)}
                  >
                    Print
                  </button>
                  <button
                    className="btn btn-danger float-end me-3"
                    onClick={() => deleteOrder(order.id)}
                  >
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
