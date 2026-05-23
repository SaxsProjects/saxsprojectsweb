// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB9T26GNKITL5uZb0Z53OmNUOOd2ylgnSU",
    authDomain: "saxsprojects-6a7eb.firebaseapp.com",
    databaseURL: "https://saxsprojects-6a7eb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "saxsprojects-6a7eb",
    storageBucket: "saxsprojects-6a7eb.firebasestorage.app",
    messagingSenderId: "424074914089",
    appId: "1:424074914089:web:a029addaca715816c1ef38",
    measurementId: "G-MG18KY62CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);