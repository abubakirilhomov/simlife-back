const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const connectDB = require('../config/database');
const authRoutes = require('../routes/AuthRoutes');
const verifyToken = require('../middlwares/verifyToken');

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

app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
