const { ContainerDB } = require('../../../containers/mongodb/containerDB.js');
const { CartsModel } = require('../../../models/carts.js');

class CartsDaoDB extends ContainerDB {
    constructor() {
        super(CartsModel);
    };

    async getAll() {
        try {
            let carts = await this.getContentDb();
            return carts;
        } catch (err) {
            throw err
        }

    };

    async save(newCart) {
        try {
            let carts = await this.getAll();
            let id = carts.length + 1;
            newCart._id = id;
            newCart.timestamp = new Date();
            await this.saveInDb(newCart);
        } catch (err) {
            throw err
        }

    };

    async deleteById(id) {
        try {
            await this.deleteContentDb({ _id: id });
        } catch (err) {
            throw err
        }
    };

    async getProductByIdCart(id) {
        try {
            let cartProducts = await this.findContentDb({ _id: id }, { products: 1, _id: 0 });
            return cartProducts;
        } catch (err) {
            throw err
        }
    };

    // necesito ver como agregar un producto a un carrito determinado

    // async addProductsToCart(id, newProduct) {
    //     let cart = await this.findContentDb({ _id: id });
    //     let productId = cart.products.length + 1;
    //     newProduct._id = productId;
    //     newProduct.timestamp = new Date();

    // };

};

module.exports = { CartsDaoDB };