// Importo el modulo de la Clase ProductsContainer
const { ProductsContainer } = require('../models/productsContainer');

const express = require('express');
const { Router } = express;
const productsRouter = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


let productsContainer = new ProductsContainer();
let administrator = true;

// Rutas
productsRouter.get('/:id?', (req, res) => {
    if (req.params.id) {
        let productFound = productsContainer.getById(parseInt(req.params.id));
        if (productFound) {
            res.json(productFound);
        } else {
            res.send('Product not found');
        };
    } else {
        let allProducts = productsContainer.getAll();
        res.json(allProducts);
    };
});

productsRouter.post('/', jsonParser, (req, res) => {
    if (administrator) {
        productsContainer.save(req.body);
        let allProducts = productsContainer.getAll();
        res.json(allProducts)
    } else {
        res.send('You are not an administrator');
    }
});

productsRouter.put('/:id', jsonParser, (req, res) => {
    if (administrator) {
        let id = parseInt(req.params.id);
        let productModified = req.body;
        productsContainer.updateById(id, productModified);
        res.json(productModified);
    } else {
        res.send('You are not an administrator');
    }
});

productsRouter.delete('/:id', (req, res) => {
    if (administrator) {
        let id = parseInt(req.params.id);
        productsContainer.deleteById(id);
        res.send('Product deleted');
    } else {
        res.send('You are not an administrator');
    }
});

module.exports = productsRouter;