const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('./database');

const app = express();

const corsOptions = {
    origin: '*', 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
    name: '1072491142946', 
  credential: admin.credential.cert(serviceAccount),
});

connectDB();

async function verifyToken(req, res, next) {
    const idToken = req.headers.authorization?.split(' ')[1];
    console.log('ID Token:', idToken); // Log the token for debugging
  
    if (!idToken) {
      return res.status(401).send({ error: 'No token provided' });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('Decoded Token:', decodedToken); // Log the decoded token
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).send({ error: 'Invalid token' });
    }
  }
  

app.post("/api/register-email", async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Create the user in Firebase
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name, // use displayName instead of name
        });

        // Save the user in MongoDB
        const newUser = new User({
            name,
            email,
            password,
            uid: userRecord.uid,
            balance: 0.00,
            business: 0.00,
            shares: 0.00,
            crypto: 0.00,
            inflationRate: '1.00%',
        });

        const savedUser = await newUser.save();
        console.log('User saved to MongoDB:', savedUser);

        res.status(200).json(savedUser);
    } catch (error) {
        console.error('Error during user registration:', error);
        
        if (error.code === 'auth/email-already-exists') {
            res.status(409).json({ error: 'The email address is already in use by another account.' });
        } else {
            res.status(500).json({ error: 'User registration failed.' });
        }
    }
});
    
app.post("/api/signin-email", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userRecord = await admin.auth().getUserByEmail(email);

        res.status(200).json({ message: 'Sign-in successful', uid: userRecord.uid });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Sign-in failed.' });
    }
});

// Apply the middleware to routes that require token verification
app.post('/api/register-google', async (req, res) => {
    const { token } = req.body;
  
    try {
      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email, name } = decodedToken;

      // Check if the user already exists in MongoDB
      let existingUser = await User.findOne({ uid });

      if (!existingUser) {
        // If the user does not exist, create a new user record in MongoDB
        const newUser = new User({
          name: name || "Anonymous", // Fallback if name is not available
          email,
          uid,
          balance: 0.00,
          business: 0.00,
          shares: 0.00,
          crypto: 0.00,
          inflationRate: '1.00%',
        });

        const savedUser = await newUser.save();
        console.log('New user registered and saved to MongoDB:', savedUser);

        res.status(200).json({ message: 'User registered successfully', user: savedUser });
      } else {
        console.log('User already exists:', existingUser);
        res.status(200).json({ message: 'User already exists', user: existingUser });
      }
    } catch (error) {
      console.error('Error during Google registration:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
});


  app.post('/api/login-google', async (req, res) => {
    const { token } = req.body;
  
    try {
      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email } = decodedToken;
  
      // Proceed with your login logic, e.g., checking user in MongoDB
      // ...
  
      res.status(200).json({ message: 'User signed in successfully', uid });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  });

app.use('/api', verifyToken);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
