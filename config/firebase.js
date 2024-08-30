const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    name: "auth-33989",
    credential: admin.credential.cert(serviceAccount),
});
