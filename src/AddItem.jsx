import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, push } from 'firebase/database';

const AddItem = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [amount, setAmount] = useState('');
  const [rating, setRating] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Function to handle image selection
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  // Function to add item and upload image
  const addItem = async (e) => {
    e.preventDefault();

    if (!name || !amount || !id || !rating || !category || !description || !image) {
      alert('Please fill out all fields and select an image.');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);

      // Get the URL of the uploaded image
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);

      // Create the item data including the image URL
      const itemData = {
        name,
        id,
        count:1,
        amount,
        rating,
        category,
        description,
        imageUrl: url,
      };

      // Store item data in Firebase Realtime Database
      const db = getDatabase();
      const itemRef = dbRef(db, 'items');
      await push(itemRef, itemData);

      alert('Item added successfully!');

      // Reset the form after upload
      setName('');
      setId('');
      setAmount('');
      setRating('');
      setCategory('');
      setDescription('');
      setImage(null);
      setImageUrl('');
    } catch (error) {
      console.error('Error uploading image and saving data:', error);
      alert('An error occurred while uploading the image.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center my-4 my-lg-3'>
      <form onSubmit={addItem} className='mx-3'>

      <div className='my-2'>
          <label className='form-label'>Id:</label>
          <input
            className='form-control text-capitalize'
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>

        <div className='my-2'>
          <label className='form-label'>Name:</label>
          <input
            className='form-control text-capitalize'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className='my-2'>
          <label className='form-label'>Amount:</label>
          <input
            className='form-control text-capitalize'
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className='my-2'>
          <label className='form-label'>Rating:</label>
          <input
            className='form-control text-capitalize'
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>

        <div className='my-2'>
          <label className='form-label'>Category:</label>
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

        <div className='my-2'>
          <label className='form-label'>Description:</label>
          <textarea
            style={{ height: '100px' }}
            className='form-control text-capitalize'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className='my-2'>
          <label className='form-label'>Image:</label>
          <input
            className='form-control text-capitalize'
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          <div className='my-2 text-center'>
            {image && <img src={URL.createObjectURL(image)} alt="Preview" className='img-fluid' width="300" />}
          </div>
        </div>

        <div className='text-center mt-3'>
          <button type="submit" disabled={isLoading} className={`btn ${isLoading ? 'btn-outline-danger' : 'btn-outline-success'}`}>
            {isLoading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
