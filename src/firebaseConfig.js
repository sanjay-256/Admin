// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8WabdyA79_NC42SoOiVIqTTJux6hQcA8",
  authDomain: "place-order-36d51.firebaseapp.com",
  databaseURL: "https://place-order-36d51-default-rtdb.firebaseio.com",
  projectId: "place-order-36d51",
  storageBucket: "place-order-36d51.appspot.com",
  messagingSenderId: "1007952004167",
  appId: "1:1007952004167:web:c03ef8e92daebb25371d62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };