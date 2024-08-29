import React, { useState } from 'react';
import { auth, provider, signInWithPopup } from './firebase'; // Import the Firebase config
import AuthGoogle from './RegisterGoogle'


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Send the registration data to the backend to handle Firebase & MongoDB registration
      const response = await fetch('http://localhost:5000/api/register-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User registered successfully:', data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
        {error && <p>{error}</p>}
      </form>
      
      <hr />
      
      <AuthGoogle />
    </div>
  );
};

export default Register;
