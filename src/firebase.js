import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBrls7nZFqAqlyl8sOZyEFwkuCm63UPA9k",
    authDomain: "iti-portal-e0269.firebaseapp.com",
    projectId: "iti-portal-e0269",
    storageBucket: "iti-portal-e0269.firebasestorage.app",
    messagingSenderId: "12611664973",
    appId: "1:12611664973:web:daac4ba054c94d32eb7004",
    measurementId: "G-ZKFTFP12HG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, onSnapshot };