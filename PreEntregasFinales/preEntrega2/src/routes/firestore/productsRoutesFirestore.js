// Importo el modulo de la Clase ProductsDaoFirestore
const { ProductsDaoFirestore } = require('../../daos/products/productsDaoFirestore');

const express = require('express');
const { Router } = express;
const productsRouter = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

let productsDaoFirestore = new ProductsDaoFirestore();
let administrator = true;

// Rutas
productsRouter.get('/:id?', async(req, res) => {
    let id = req.params.id
    if (id) {
        let productFound = await productsDaoFirestore.getById(id);
        if (productFound) {
            res.json(productFound);
        } else {
            res.send('Product not found');
        };
    } else {
        let allProducts = await productsDaoFirestore.getAll();
        res.json(allProducts);
    };
});

// ----------------ESTOY TENIENDO PROBLEMAS CON EL REQ.BODY
productsRouter.post('/', jsonParser, async(req, res) => {
    if (administrator) {
        console.log(req.body);
        await productsDaoFirestore.save(req.body);
        let allProducts = await productsDaoFirestore.getAll();
        res.json(allProducts)
    } else {
        res.send('You are not an administrator');
    }
});

// ----------------ESTOY TENIENDO PROBLEMAS CON EL REQ.BODY
productsRouter.put('/:id', jsonParser, async(req, res) => {
    if (administrator && req.body.name && req.body.price && req.body.description && req.body.url && req.body.code && req.body.stock) {
        let id = req.params.id;
        let productModified = await productsDaoFirestore.updateById(id, req.body);
        res.json(productModified);
    } else {
        res.send('You are not an administrator or you have not filled all the fields');
    }
});

productsRouter.delete('/:id', async(req, res) => {
    if (administrator) {
        let id = req.params.id;
        await productsDaoFirestore.deleteById(id);
        res.send('Product deleted');
    } else {
        res.send('You are not an administrator');
    }
});

module.exports = productsRouter;