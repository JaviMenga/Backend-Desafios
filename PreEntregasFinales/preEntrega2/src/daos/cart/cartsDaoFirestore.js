const { ContainerFirestore } = require('../../containers/containerFirestore');

class CartsDaoFirestore extends ContainerFirestore {
    constructor() {
        super('carts');
    };

    async getAll() {
        try {
            let contentDB = await this.getContentDB();
            let docs = contentDB.docs;

            const resp = docs.map((doc) => ({
                id: doc.data().id,
                products: doc.data().products,
                timestamp: doc.data().timestamp
            }));
            return resp;
        } catch (err) {
            throw err;
        };
    };

    async save(newCart) {
        try {
            let carts = await this.getContentDB();
            let docs = carts.docs;
            let lastId = docs[docs.length - 1].id;
            let id = (parseInt(lastId) + 1).toString();

            newCart.timestamp = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} : ${new Date().getHours()}-${new Date().getMinutes()}:${new Date().getSeconds()}`;

            await this.saveInDb(newCart, id);
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

    async deleteById(id) {
        try {
            await this.deleteContentDb(id);
        } catch (err) {
            throw err
        }
    };

    async getProductByIdCart(id) {
        try {
            let products = null;
            let cart = await this.findContentDb(id);
            if (cart) {
                products = cart.products;
            }
            return products;
        } catch (err) {
            throw err
        }
    };

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