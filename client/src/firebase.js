// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB1pUd_MtqXBOovx4OMrwqO0GrZFa78IZs",
  authDomain: "auth-33989.firebaseapp.com",
  projectId: "auth-33989",
  storageBucket: "auth-33989.appspot.com",
  messagingSenderId: "1072491142946",
  appId: "1:1072491142946:web:0cc73a7dddf2d88b69cf7b",
  measurementId: "G-3PF9729SRM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };