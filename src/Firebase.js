// import firebase1 from 'firebase';
// var firebaseConfig = {
//   // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   // appId: process.env.REACT_APP_FIREBASE_APPID,
//   // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
//   apiKey: 'AIzaSyAnOIHrRunqD82BN6yscpcg78rNTLxSAhM',
//   authDomain: 'revenuesharinginvest-44354.firebaseapp.com',
//   projectId: 'revenuesharinginvest-44354',
//   storageBucket: 'revenuesharinginvest-44354.appspot.com',
//   messagingSenderId: '71002133649',
//   appId: '1:71002133649:web:1f8ca95c618519df339b30',
//   measurementId: 'G-YPFBPWMLF6'
// };
// firebase1.initializeApp(firebaseConfig);
// export { firebase1 };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLBV7jmbyQMWiXpY4Id5Lt-LRnWgTNETw",
  authDomain: "krowdinvestment.firebaseapp.com",
  projectId: "krowdinvestment",
  storageBucket: "krowdinvestment.appspot.com",
  messagingSenderId: "542746657150",
  appId: "1:542746657150:web:aa01289296ead53820f32f",
  measurementId: "G-ZZVEBWVHXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
