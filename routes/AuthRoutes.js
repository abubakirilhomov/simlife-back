const express = require('express');
const admin = require('firebase-admin');
const User = require('../models/User');

const router = express.Router();

// Register with email and password
router.post('/register-email', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

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

// Sign in with email and password
router.post('/signin-email', async (req, res) => {
    try {
        const { email, password } = req.body;

        const userRecord = await admin.auth().getUserByEmail(email);

        res.status(200).json({ message: 'Sign-in successful', uid: userRecord.uid });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Sign-in failed.' });
    }
});

// Register using Google
router.post('/register-google', async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name } = decodedToken;

        let user = await User.findOne({ uid });
        if (!user) {
            user = new User({
                name,
                email,
                uid,
                balance: 0.00,
                business: 0.00,
                shares: 0.00,
                crypto: 0.00,
                inflationRate: '1.00%',
            });
            await user.save();
        }

        res.status(200).json({ message: 'User registered successfully', uid });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// Sign in using Google
router.post('/login-google', async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name } = decodedToken;

        let user = await User.findOne({ uid });
        if (!user) {
            if (!name) {
                return res.status(400).json({ error: 'Name is required.' });
            }
            user = new User({
                name,
                email,
                uid,
                balance: 0.00,
                business: 0.00,
                shares: 0.00,
                crypto: 0.00,
                inflationRate: '1.00%',
            });
            await user.save();
        }

        res.status(200).json({ message: 'User signed in successfully', uid });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;
