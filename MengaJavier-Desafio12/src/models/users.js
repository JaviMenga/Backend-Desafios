const mongoose = require('mongoose');

const usersCollection = 'users';
const UserShema = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    address: { type: String, require: true }
});

const UsersModel = mongoose.model(usersCollection, UserShema);

module.exports = { UsersModel };