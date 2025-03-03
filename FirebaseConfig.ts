// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//@ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "./app.json";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: Constants.expo.extra.firebaseApiKey,
  authDomain: Constants.expo.extra.firebaseAuthDomain,
  projectId: Constants.expo.extra.firebaseProjectId,
  storageBucket: Constants.expo.extra.firebaseStorageBucket,
  messagingSenderId: Constants.expo.extra.firebaseMessagingSenderId,
  appId: Constants.expo.extra.firebaseAppId,
  measurementId: Constants.expo.extra.firebaseMeasurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
