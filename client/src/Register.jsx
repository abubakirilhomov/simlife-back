import React, { useState } from 'react';
import { auth } from './firebase'; // Import the Firebase config
import RegisterGoogle from './RegisterGoogle';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isGoogleRegistered, setIsGoogleRegistered] = useState(false);

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
        // Redirect or update state as needed
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError(error.message);
    }
  };

  const handleGoogleRegisterSuccess = () => {
    setIsGoogleRegistered(true);
  };

  return (
    <div>
      {!isGoogleRegistered ? (
        <>
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
        </>
      ) : null}

      <RegisterGoogle onSuccess={handleGoogleRegisterSuccess} />
    </div>
  );
};

export default Register;
