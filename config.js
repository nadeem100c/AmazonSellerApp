import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/firestore";

// app firebase configration

const firebaseConfig = {
  apiKey: "AIzaSyAr6FDXtqXgy0zwNNcZF7zFEz672MD4J1k",
  authDomain: "app-1b084.firebaseapp.com",
  projectId: "app-1b084",
  storageBucket: "app-1b084.appspot.com",
  messagingSenderId: "987254408781",
  appId: "1:987254408781:web:7bfde74f89e6fdbac67e04",
  measurementId: "G-RVKQ4R5P1F",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const saleDetailsRef = db.collection("SaleDetails");
export { firebase, saleDetailsRef };
