import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const signIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed in:', user);
      })
      .catch((error) => {
        console.error("Error during sign-in", error);
      });
  };
  
