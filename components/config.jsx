// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhXAn5SJTrtFrHNYpJBBE115cEJBsjiFQ",
  authDomain: "hitch-709f6.firebaseapp.com",
  databaseURL:
    "https://hitch-709f6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hitch-709f6",
  storageBucket: "hitch-709f6.appspot.com",
  messagingSenderId: "372096459076",
  appId: "1:372096459076:web:038e50c19ff3b8294ff711",
  measurementId: "G-79LEDZLMLQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);
