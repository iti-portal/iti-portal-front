import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAE7jS-usf-lfXB0VKHiGDnkt6s45-NIfE",
    authDomain: "uniti-77eaa.firebaseapp.com",
    projectId: "uniti-77eaa",
    storageBucket: "uniti-77eaa.firebasestorage.app",
    messagingSenderId: "597114938960",
    appId: "1:597114938960:web:029ff7e3b48386c75fd355",
    measurementId: "G-8LZHVZ1GQ3"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, onSnapshot };