// Importo el modulo de la Clase ProductsDao
const { ProductsDao } = require('../../daos/products/productsDao.js');

const express = require('express');
const { Router } = express;
const productsRouter = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


let productsDao = new ProductsDao();
let administrator = true;

// Rutas
productsRouter.get('/:id?', (req, res) => {
    if (req.params.id) {
        let productFound = productsDao.getById(parseInt(req.params.id));
        if (productFound) {
            res.json(productFound);
        } else {
            res.send('Product not found');
        };
    } else {
        let allProducts = productsDao.getAll();
        res.json(allProducts);
    };
});

// ----------------ESTOY TENIENDO PROBLEMAS CON EL REQ.BODY
productsRouter.post('/', jsonParser, (req, res) => {
    if (administrator) {
        productsDao.save(req.body);
        let allProducts = productsDao.getAll();
        res.json(allProducts)
    } else {
        res.send('You are not an administrator');
    }
});

productsRouter.put('/:id', jsonParser, (req, res) => {
    if (administrator) {
        let id = parseInt(req.params.id);
        let productModified = req.body;
        productsDao.updateById(id, productModified);
        res.json(productModified);
    } else {
        res.send('You are not an administrator');
    }
});

productsRouter.delete('/:id', (req, res) => {
    if (administrator) {
        let id = parseInt(req.params.id);
        productsDao.deleteById(id);
        res.send('Product deleted');
    } else {
        res.send('You are not an administrator');
    }
});

module.exports = productsRouter;