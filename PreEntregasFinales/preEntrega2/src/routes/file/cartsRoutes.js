// Importo el modulo de la Clase CartsContainer
const { CartsDao } = require('../../daos/carts/file/cartsDao.js');

const express = require('express');
const { Router } = express;
const cartsRouter = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


let cartsDao = new CartsDao();

// Rutas
cartsRouter.post('/', jsonParser, (req, res) => {
    cartsDao.save();
    let carts = cartsDao.getAll();
    let cartId = carts[carts.length - 1].id;
    console.log(cartId);
    res.send(`The ID of your Cart is ${cartId}`);
});

cartsRouter.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    cartsDao.deleteCart(id)
    res.send('Your Cart has been deleted');
});

cartsRouter.get('/:id/products', (req, res) => {
    let id = parseInt(req.params.id);
    let cart = cartsDao.getById(id);
    if (cart) {
        res.json(cart.products);
    } else {
        res.send('Cart not found');
    }
});

cartsRouter.post('/:id/products', jsonParser, (req, res) => {
    let id = parseInt(req.params.id);
    let product = req.body;
    let cart = cartsDao.addProductsToCart(id, product);
    if (cart) {
        res.send('Your product has been added to your cart');
    } else {
        res.send('Cart not found');
    }
});

cartsRouter.delete('/:id/products/:id_prod', (req, res) => {
    let cartId = parseInt(req.params.id);
    let productId = parseInt(req.params.id_prod);
    cartsDao.deleteProductsToCartById(cartId, productId);
    res.send('Your product has been deleted from your cart');

});

module.exports = cartsRouter;