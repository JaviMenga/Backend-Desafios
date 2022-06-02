const { ContainerFirestore } = require('../../../containers/firestore/containerFirestore');

class CartsDaoFirestore extends ContainerFirestore {
    constructor() {
        super('carts');
    };

    async getAll() {
        try {
            let contentDB = await this.getContentDB();
            return contentDB;
        } catch (err) {
            throw err;
        };
    };

    async save(newProduct) {
        try {
            newProduct.timestamp = 'new Date()';
            await this.saveInDb(newProduct);
        } catch (err) {
            throw err
        };
    };

    // async getById(id) {
    //     try {
    //         let product = await this.findContentDb(id)
    //         return product;
    //     } catch (err) {
    //         throw err
    //     };
    // };

    // async deleteById(id) {
    //     try {
    //         await this.deleteContentDb(id);
    //     } catch (err) {
    //         throw err
    //     }
    // };

    // async updateById(id, update) {
    //     try {
    //         let result = await this.updateContentDb(id, update);
    //         return result;
    //     } catch (err) {
    //         throw err
    //     }
    // };
};

module.exports = { CartsDaoFirestore };