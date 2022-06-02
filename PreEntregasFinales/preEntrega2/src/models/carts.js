const mongoose = require('mongoose');

const cartsCollection = 'carts';
const CartsShema = new mongoose.Schema({
    _id: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    products: [{
        _id: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        code: { type: String, required: true },
        url: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        timestamp: { type: Date, required: true }
    }]
});

const CartsModel = mongoose.model(cartsCollection, CartsShema);

module.exports = { CartsModel };