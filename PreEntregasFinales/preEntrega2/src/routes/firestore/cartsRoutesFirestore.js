// Importo el modulo de la Clase CartsContainerFirestore
const { CartsDaoFirestore } = require('../../daos/cart/firestore/cartsDaoFirestore.js');

const express = require('express');
const { Router } = express;
const cartsRouter = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


let cartsDaoFirestore = new CartsDaoFirestore();

// Rutas
// cartsRouter.post('/', jsonParser, async(req, res) => {
//     await cartsDaoFirestore.save(req.body);
//     let carts = await cartsDaoFirestore.getAll();
//     let cartId = carts[carts.length - 1]._id;
//     console.log(cartId);
//     res.send(`The ID of your Cart is ${cartId}`);
// });

// cartsRouter.delete('/:id', (req, res) => {
//     let id = parseInt(req.params.id);
//     cartsDaoFirestore.deleteById(id)
//     res.send('Your Cart has been deleted');
// });

// cartsRouter.get('/:id/products', async(req, res) => {
//     let id = parseInt(req.params.id);
//     let cartProducts = await cartsDaoFirestore.getProductByIdCart(id);
//     if (cartProducts) {
//         res.json(cartProducts);
//     } else {
//         res.send('Cart not found');
//     }
// });

// necesito ver como agregar un product a un carrito determinado
// cartsRouter.post('/:id/products', jsonParser, (req, res) => {
//     let id = parseInt(req.params.id);
//     let product = req.body;
//     let cart = cartsDaoFirestore.addProductsToCart(id, product);
//     if (cart) {
//         res.send('Your product has been added to your cart');
//     } else {
//         res.send('Cart not found');
//     }
// });

// cartsRouter.delete('/:id/products/:id_prod', (req, res) => {
//     let cartId = parseInt(req.params.id);
//     let productId = parseInt(req.params.id_prod);
//     cartsDaoFirestore.deleteProductsToCartById(cartId, productId);
//     res.send('Your product has been deleted from your cart');

// });

module.exports = cartsRouter;