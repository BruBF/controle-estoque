// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_YgAyyQgeLAdBIj6S3wUPVKwenu9kdK8",
  authDomain: "controle-de-estoque-1e622.firebaseapp.com",
  projectId: "controle-de-estoque-1e622",
  storageBucket: "controle-de-estoque-1e622.firebasestorage.app",
  messagingSenderId: "627570584211",
  appId: "1:627570584211:web:084ed5ce09d3fd0386bb66",
  measurementId: "G-CPJY7ZFSG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
