// Importo el modulo de la Clase CartsContainerDB
const { CartsDaoDB } = require('../../daos/cart/cartsDaoDB.js');

const express = require('express');
const { Router } = express;
const cartsRouter = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


let cartsDaoDB = new CartsDaoDB();

// Rutas
// ----------------ESTOY TENIENDO PROBLEMAS CON EL REQ.BODY
cartsRouter.post('/', jsonParser, async(req, res) => {
    await cartsDaoDB.save(req.body);
    let carts = await cartsDaoDB.getAll();
    let cartId = carts[carts.length - 1]._id;
    res.send(`The ID of your Cart is ${cartId}`);
});

cartsRouter.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    cartsDaoDB.deleteById(id)
    res.send('Your Cart has been deleted');
});

cartsRouter.get('/:id/products', async(req, res) => {
    let id = parseInt(req.params.id);
    let cartProducts = await cartsDaoDB.getProductByIdCart(id);
    if (cartProducts) {
        res.json(cartProducts);
    } else {
        res.send('Products not found');
    }
});

// necesito ver como agregar un product a un carrito determinado
// cartsRouter.post('/:id/products', jsonParser, (req, res) => {
//     let id = parseInt(req.params.id);
//     let product = req.body;
//     let cart = cartsDaoDB.addProductsToCart(id, product);
//     if (cart) {
//         res.send('Your product has been added to your cart');
//     } else {
//         res.send('Cart not found');
//     }
// });

// cartsRouter.delete('/:id/products/:id_prod', (req, res) => {
//     let cartId = parseInt(req.params.id);
//     let productId = parseInt(req.params.id_prod);
//     cartsDaoDB.deleteProductsToCartById(cartId, productId);
//     res.send('Your product has been deleted from your cart');

// });

module.exports = cartsRouter;