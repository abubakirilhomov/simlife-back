const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const connectDB = require('../config/database');
const authRoutes = require('../routes/AuthRoutes');
const verifyToken = require('../middlwares/verifyToken');

const app = express();
const expressWs = require('express-ws')(app);

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



let clients = [];

app.ws('/', (ws, req) => {
    console.log('WebSocket successfully connected');
    clients.push(ws);
    ws.on('message', (msg) => {
        const receivedMessage = JSON.parse(msg);
        console.log('Received message:', receivedMessage);
        clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({
                    ...receivedMessage,
                    sender: 'Server',
                }));
            }
        });
    });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
