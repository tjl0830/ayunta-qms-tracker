// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase configuration object from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCRwTJjwKbDwIz34soPCTTzWoFy1GFBGAE",
  authDomain: "ayuntamiento-qms.firebaseapp.com",
  databaseURL:
    "https://ayuntamiento-qms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ayuntamiento-qms",
  storageBucket: "ayuntamiento-qms.firebasestorage.app",
  messagingSenderId: "597457203650",
  appId: "1:597457203650:web:42827992402576319fe65b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const database = getDatabase(app); // Initialize Realtime Database

// Export your initialized Firebase services to use them throughout your app
export { database };
