import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';

const RegisterGoogle = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [idToken, setIdToken] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get ID token from the result
      const token = await result.user.getIdToken();
      setIdToken(token);
      setIsSignedIn(true);
    } catch (error) {
      console.error('Google Sign-In failed:', error.response?.data || error.message);
    }
  };

  const handleRegistration = async () => {
    try {
      // Send the token, username, and password to the backend
      const response = await axios.post('http://localhost:5000/api/register-google', {
        token: idToken,
        username,
        password,
      });

      console.log('Registration successful:', response.data);
      onSuccess(); // Call the onSuccess callback to update the Register component
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      {!isSignedIn ? (
        <button onClick={handleGoogleSignIn}>
          Sign In with Google
        </button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegistration}>
            Register with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterGoogle;
