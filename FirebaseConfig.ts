// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYQf_CKXlO405Pz1Akn3zmmm2SOVrJJ5M",
  authDomain: "calories-expo.firebaseapp.com",
  projectId: "calories-expo",
  storageBucket: "calories-expo.firebasestorage.app",
  messagingSenderId: "97702376256",
  appId: "1:97702376256:web:7baf5c427344b647bcc0a5",
  measurementId: "G-T3FX9V016R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
