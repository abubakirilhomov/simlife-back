const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, required: true, unique: true },
    picture: String,
    balance: { type: Number, default: 0.00 },
    business: { type: Number, default: 0.00 },
    shares: { type: Number, default: 0.00 },
    crypto: { type: Number, default: 0.00 },
    inflationRate: { type: String, default: '1.00%' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
