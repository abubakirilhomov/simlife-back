const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('../models/User');
require('dotenv').config();  // Load environment variables
const connectDB = require('./database');

const app = express();

// CORS Options
const corsOptions = {
    origin: 'http://localhost:5174', // Replace with your frontend's URL, remove trailing slash
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to MongoDB
connectDB();

// Middleware to verify Firebase ID Token
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split(' ')[1];

  if (!idToken) {
    return res.status(401).send({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send({ error: 'Invalid token' });
  }
}

// Apply the verifyToken middleware to all routes under '/api'

// Email/Password Registration Route
app.post("/api/register-email", async (req, res) => {
    try {
        // Check if the user already exists in Firebase
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(req.body.email);
            return res.status(400).json({ error: 'Email is already in use.' });
        } catch (error) {
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
        }

        // Create the user in Firebase
        userRecord = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.name,
            emailVerified: false,
            disabled: false
        });

        // Save the user to MongoDB with default values
        const user = new User({
            uid: userRecord.uid,
            name: userRecord.displayName,
            email: userRecord.email,
            balance: 0.00,
            business: 0.00,
            shares: 0.00,
            crypto: 0.00,
            inflationRate: '1.00%'
        });

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error during email registration:', error);
        res.status(500).json({ error: 'User registration failed.' });
    }
});

// Email/Password Sign-In Route
app.post("/api/signin-email", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify the email/password using Firebase Authentication
        const userRecord = await admin.auth().getUserByEmail(email);

        // Here you would use Firebase client SDK on the frontend to sign in with email/password,
        // and then send the ID token to the backend, where you verify it using the verifyToken middleware.

        res.status(200).json({ message: 'Sign-in successful', uid: userRecord.uid });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Sign-in failed.' });
    }
});

// Verify Token and Register User Route
app.post("/api/register", async (req, res) => {
    try {
        console.log("Decoded user info:", req.user);
        const { uid, name, email, picture } = req.user;

        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({ uid, name, email, picture });
            await user.save();
            console.log("User saved:", user);
        }

        res.status(200).send(user);
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send({ error: 'User registration failed.' });
    }
});

// Apply the verifyToken middleware
app.use('/api', verifyToken);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
