const res = require('express/lib/response');
const { Container } = require('./container.js');

class CartsContainer extends Container {
    constructor() {
        super('./src/data/carts.json');
        let carts = this.getAll();
        this.id = (carts.length > 0) ? carts.length + 1 : 1;
    }

    save() {
        let carts = this.getAll();
        let cart = { id: this.id, timestamp: Date.now(), products: [] }
        carts.push(cart);
        this.saveInFile(carts);
        this.id++;

        return cart;
    }

    getAll() {
        let carts = this.getContentFile();

        return carts;
    }

    getById(id) {
        let carts = this.getAll();
        let cart = null;

        if (carts.length > 0) {
            let ct = carts.find(c => c.id === id);

            if (ct) {
                cart = ct;
            }
        }

        return cart;
    }

    addProductsToCart(cartId, product) {
        let carts = this.getAll();
        let cart = null;
        if (carts.length > 0) {
            let cartID = carts.find(c => c.id === cartId);

            if (cartID) {
                product.id = cartID.products.length + 1;
                product.timestamp = Date.now();
                cartID.products.push(product);
                cart = cartID;
            }
            this.saveInFile(carts);
        }

        return cart;

    }

    deleteProductsToCartById(cartId, productId) {
        let carts = this.getAll();
        let cart = null;
        if (carts.length > 0) {
            let cartID = carts.find(c => c.id === cartId);
            if (cartID) {
                let product = cartID.products.find(p => p.id === productId);
                if (product) {
                    cartID.products.splice([productId - 1], 1);
                    cart = cartID;
                } else {
                    res.send('Product not found');
                }
            } else {
                res.send('Cart not found');
            }
        }
        this.saveInFile(carts);
        return cart;
    }

    deleteCart(id) {
        let carts = this.getAll();
        carts.splice([id - 1], 1);
        this.saveInFile(carts)
    }
}

module.exports = { CartsContainer };