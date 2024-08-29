import React from 'react';
import { auth, provider } from './firebase'; // Import the Firebase config
import { signInWithPopup } from 'firebase/auth';

const GoogleSignIn = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the Firebase ID token
      const token = await user.getIdToken();

      // Send the ID token to your backend
      const res = await fetch('http://localhost:5000/api/login-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('User signed in successfully:', data);
      } else {
        console.error('Sign-in failed:', data.error);
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;
