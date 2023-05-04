// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXw4wF9kQY02acK8NIKvllgxKAFkjiWS0",
  authDomain: "read-that-omega.firebaseapp.com",
  projectId: "read-that-omega",
  storageBucket: "read-that-omega.appspot.com",
  messagingSenderId: "665544877435",
  appId: "1:665544877435:web:786829fcf30ee63252c9de",
  measurementId: "G-Y59LW4TY14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);