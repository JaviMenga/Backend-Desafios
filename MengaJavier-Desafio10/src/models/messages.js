const mongoose = require('mongoose');

const messagesCollection = 'messages';
const MessagesShema = new mongoose.Schema({
    author: {
        email: { type: String, required: true },
        name: { type: String, required: true },
        lastname: { type: String, required: true },
        alias: { type: String, required: true },
        age: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    text: { type: String, required: true },
    date: { type: String, required: true }
});

const MessagesModel = mongoose.model(messagesCollection, MessagesShema);

module.exports = { MessagesModel };