const { ContainerFirestore } = require('../../containers/containerFirestore');

class ProductsDaoFirestore extends ContainerFirestore {
    constructor() {
        super('products');
    };

    async getAll() {
        try {
            let contentDB = await this.getContentDB();
            let docs = contentDB.docs;

            const resp = docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                timestamp: doc.data().timestamp,
                description: doc.data().description,
                code: doc.data().code,
                stock: doc.data().stock,
                url: doc.data().url,
                price: doc.data().price

            }));
            return resp;
        } catch (err) {
            throw err;
        };
    };

    async save(newProduct) {
        try {
            let products = await this.getContentDB();
            let docs = products.docs;
            let lastId = docs[docs.length - 1].id;
            let id = (parseInt(lastId) + 1).toString();
            newProduct.timestamp = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} : ${new Date().getHours()}-${new Date().getMinutes()}:${new Date().getSeconds()}`;
            await this.saveInDb(newProduct, id);
        } catch (err) {
            throw err
        };
    };

    async getById(id) {
        try {
            let product = await this.findContentDb(id)
            return product;
        } catch (err) {
            throw err
        };
    };

    async deleteById(id) {
        try {
            await this.deleteContentDb(id);
        } catch (err) {
            throw err
        }
    };

    async updateById(id, update) {
        try {
            let result = await this.updateContentDb(id, update);
            return result;
        } catch (err) {
            throw err
        }
    };

};

module.exports = { ProductsDaoFirestore };