const { Container } = require('./container.js');

class ProductsContainer extends Container {
    constructor() {
        super('./src/data/products.json');
        let products = this.getAll();
        this.id = (products.length > 0) ? products.length + 1 : 1;
    }

    save(newProduct) {
        let products = this.getAll();
        newProduct.id = this.id;
        newProduct.timestamp = Date.now();
        products.push(newProduct);
        this.saveInFile(products);
        this.id++
    }

    getAll() {
        let products = this.getContentFile();
        return products;
    }

    getById(id) {
        let products = this.getAll();
        let product = null;

        if (products.length > 0) {
            let prod = products.find(p => p.id === id);

            if (prod) {
                product = prod;
            }
        }

        return product;
    }

    deleteById(id) {
        let products = this.getAll();
        products.splice([id - 1], 1);
        this.saveInFile(products);
    }

    deleteAll() {
        let products = this.getAll();
        products = [];
        this.saveInFile(products);
    }

    updateById(id, newProduct) {
        let products = this.getAll();
        newProduct.id = id;

        if (products.length > 0) {
            let prod = products.find(p => p.id === id);

            if (prod) {
                prod = newProduct;
                products[id - 1] = prod;
                this.saveInFile(products);
            } else {
                console.log('Product not found');
            }

        }

    }
}

module.exports = { ProductsContainer }