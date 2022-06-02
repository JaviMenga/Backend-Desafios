// Importo el modulo de la Clase ProductsDaoDB
const { ProductsDaoDB } = require('../../daos/products/mongodb/productsDaoDB.js');

const express = require('express');
const { Router } = express;
const productsRouter = Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


let productsDaoDB = new ProductsDaoDB();
let administrator = true;

// Rutas
productsRouter.get('/:id?', async(req, res) => {
    let id = parseInt(req.params.id)
    if (id) {
        let productFound = await productsDaoDB.getById(id);
        if (productFound) {
            res.json(productFound);
        } else {
            res.send('Product not found');
        };
    } else {
        let allProducts = await productsDaoDB.getAll();
        res.json(allProducts);
    };
});

productsRouter.post('/', jsonParser, async(req, res) => {
    if (administrator) {
        await productsDaoDB.save(req.body);
        let allProducts = await productsDaoDB.getAll();
        res.json(allProducts)
    } else {
        res.send('You are not an administrator');
    }
});

// productsRouter.put('/:id', jsonParser, async(req, res) => {
//     if (administrator) {
//         let id = parseInt(req.params.id);

//         // necesito ver como se que actualización están pasando por Body
//         productsDaoDB.updateById(id, productModified);
//         res.json(productModified);
//     } else {
//         res.send('You are not an administrator');
//     }
// });

productsRouter.delete('/:id', async(req, res) => {
    if (administrator) {
        let id = parseInt(req.params.id);
        await productsDaoDB.deleteById(id);
        res.send('Product deleted');
    } else {
        res.send('You are not an administrator');
    }
});

module.exports = productsRouter;