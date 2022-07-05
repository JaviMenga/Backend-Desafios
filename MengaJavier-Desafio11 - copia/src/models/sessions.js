const mongoose = require('mongoose');

const sessionsCollection = 'sessions';
const SessionsShema = new mongoose.Schema({
    expires: { type: Date, required: true },
    session: { type: String, required: true }
});

const SessionsModel = mongoose.model(sessionsCollection, SessionsShema);

module.exports = { SessionsModel };