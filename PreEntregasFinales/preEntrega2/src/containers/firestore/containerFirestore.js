let admin = require("firebase-admin");

let serviceAccount = require("../../data/firestoreKey/backenddb-7b7a5-firebase-adminsdk-v1epw-ef72224d34.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

console.log("firestore initialized");

class ContainerFirestore {
    constructor(collection) {
        this.db = admin.firestore().collection(collection);
    };

    async saveInDb(content) {
        try {
            let products = await this.getContentDB();
            let id = (products.length + 1).toString();
            let doc = this.db.doc(id);
            await doc.create(content)
            console.log('Productos guardados en la base de datos');
            id++

        } catch (err) {
            throw err
        }
    };

    async getContentDB() {
        try {
            let contentDB = await this.db.get();
            let docs = contentDB.docs;

            const resp = docs.map((doc) => {
                return doc.data();
            });
            return resp

        } catch (err) {
            throw err
        };
    };

    async deleteContentDb(id) {
        try {
            let doc = this.db.doc(id);
            await doc.delete();
            console.log('Producto eliminado de la base de datos');
        } catch (err) {
            throw err
        }
    };

    async findContentDb(id) {
        try {
            let doc = this.db.doc(id)
            let contentDB = await doc.get();
            let data = contentDB.data();
            return data
        } catch (err) {
            throw err
        }
    };

    async updateContentDb(id, update) {
        try {
            let doc = this.db.doc(id);
            await doc.update(update);
            console.log('Producto actualizado en la base de datos');
            return (await doc.get()).data();
        } catch (err) {
            throw err
        }
    };

};

module.exports = { ContainerFirestore }