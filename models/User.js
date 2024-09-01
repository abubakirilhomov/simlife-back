const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    chat_id: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0.00 },
    business: { type: Number, default: 0.00 },
    shares: { type: Number, default: 0.00 },
    crypto: { type: Number, default: 0.00 },
    inflationRate: { type: String, default: '1.00%' },
});

module.exports = mongoose.model('User', UserSchema);
