import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";

require("dotenv").config();

console.log(process.env.REACT_APP_apiKey);

var app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
});

export const storage = firebase.storage();
export const firestore = firebase.firestore();

export default app;
