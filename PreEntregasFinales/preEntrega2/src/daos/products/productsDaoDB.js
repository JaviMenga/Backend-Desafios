const { ContainerDB } = require('../../containers/containerDB');
const { ProductsModel } = require('../../models/products');

class ProductsDaoDB extends ContainerDB {
    constructor() {
        super(ProductsModel);
    };

    async getAll() {
        let products = await this.getContentDb();
        return products;
    };

    async save(newProduct) {
        let products = await this.getAll();
        let id = products.length + 1;
        newProduct._id = id;
        newProduct.timestamp = new Date();
        await this.saveInDb(newProduct);
    };

    async getById(id) {
        let product = await this.findContentDb({ _id: id })
        return product;
    };

    async deleteById(id) {
        try {
            await this.deleteContentDb({ _id: id });
        } catch (err) {
            throw err
        }
    };

    async deleteAll() {
        try {
            await this.deleteContentDb();
        } catch (err) {
            throw err
        }
    };

    // necesito saber como pasar el body
    // async updateById(id, update) {
    //     try {
    //         let result = await this.UpdateContentDb({ _id: id }, update);
    //     } catch (err) {
    //         throw err
    //     }
    // };



}

module.exports = { ProductsDaoDB }