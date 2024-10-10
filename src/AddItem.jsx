import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, update, get, query, orderByChild, equalTo } from 'firebase/database';

const AddItem = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [amount, setAmount] = useState('');
  const [rating, setRating] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [firebaseKey, setFirebaseKey] = useState(null);  // Store Firebase key for editing

  // Handle image selection
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  // Fetch item by the internal `id` field
  const fetchItemById = async (e) => {
    e.preventDefault();

    if (!id) {
      alert('Please enter a valid ID.');
      return;
    }

    const db = getDatabase();
    const itemsRef = dbRef(db, 'items');
    const idQuery = query(itemsRef, orderByChild('id'), equalTo(id));

    try {
      const snapshot = await get(idQuery);

      if (snapshot.exists()) {
        // Get the Firebase key and the item data
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const itemData = childSnapshot.val();

          // Populate the form with the item data
          setName(itemData.name);
          setAmount(itemData.amount);
          setRating(itemData.rating);
          setCategory(itemData.category);
          setDescription(itemData.description);
          setImageUrl(itemData.imageUrl);
          setFirebaseKey(key); // Save Firebase key for future updates
          setIsEditMode(true); // Enable edit mode
        });

        alert('Item data loaded for editing.');
      } else {
        alert('No item found with the given ID.');
      }
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      alert('An error occurred while fetching the item.');
    }
  };

  // Function to add or edit item
  const addItem = async (e) => {
    e.preventDefault();

    if (!name || !amount || !id || !rating || !category || !description) {
      alert('Please fill out all fields and select an image.');
      return;
    }

    setIsLoading(true);

    try {
      let url = imageUrl;

      // If a new image is selected, upload it to Firebase Storage
      if (image) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        url = await getDownloadURL(storageRef);
        setImageUrl(url);
      }

      // Create or update the item data
      const itemData = {
        name,
        id,
        count: 1,
        amount,
        rating,
        category,
        description,
        imageUrl: url,
      };

      const db = getDatabase();

      if (isEditMode && firebaseKey) {
        // Update the existing item in Firebase by Firebase key
        const itemRef = dbRef(db, `items/${firebaseKey}`);
        await update(itemRef, itemData);
        alert('Item updated successfully!');
      } else {
        alert('Please enter a valid ID to edit.');
      }

      // Reset the form after submission
      setName('');
      setId('');
      setAmount('');
      setRating('');
      setCategory('');
      setDescription('');
      setImage(null);
      setImageUrl('');
      setIsEditMode(false); // Reset edit mode
      setFirebaseKey(null);  // Reset Firebase key
    } catch (error) {
      console.error('Error uploading image and saving data:', error);
      alert('An error occurred while uploading the image or saving data.');
    } finally {
      setIsLoading(false);
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
          <button onClick={fetchItemById} className="btn btn-outline-primary my-2">Fetch Item</button>
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
            type="text"
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
          <input
            className='form-control text-capitalize'
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className='my-2'>
          <label className='form-label'>Description:</label>
          <textarea
            className='form-control text-capitalize'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className='my-2'>
          <label className='form-label'>Image:</label>
          <input type="file" onChange={handleImageUpload} />

          {/* Display image preview for both editing and adding */}
          <div className='my-2 text-center'>
            {imageUrl ? (
              /* Show image from the uploaded URL when editing */
              <img src={imageUrl} alt="Uploaded item" width="200" />
            ) : (
              image && (
                /* Show preview of the newly selected image while adding */
                <img src={URL.createObjectURL(image)} alt="Preview" width="200" />
              )
            )}
          </div>
        </div>


        <div className="text-center my-2">
          <button type="submit" className="btn btn-primary my-2" disabled={isLoading}>
            {isEditMode ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
