let admin = require("firebase-admin");

let serviceAccount = require("../data/firestoreKey/backenddb-7b7a5-firebase-adminsdk-v1epw-ef72224d34.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

console.log("firestore initialized");

class ContainerFirestore {
    constructor(collection) {
        this.collection = db.collection(collection);
    };

    async saveInDb(content, id) {
        try {
            let doc = this.collection.doc(id);
            let item = await doc.create(content);
            return item;
        } catch (err) {
            throw err
        }
    };

    async getContentDB() {
        try {
            let contentDB = await this.collection.get();
            return contentDB;

        } catch (err) {
            throw err
        };
    };

    async deleteContentDb(id) {
        try {
            let doc = this.collection.doc(id);
            await doc.delete();
        } catch (err) {
            throw err
        }
    };

    async findContentDb(id) {
        try {
            let doc = this.collection.doc(id)
            let contentDB = await doc.get();
            let data = contentDB.data();
            return data
        } catch (err) {
            throw err
        }
    };

    async updateContentDb(id, update) {
        try {
            let doc = this.collection.doc(id);
            await doc.update(update);
            console.log('Producto actualizado en la base de datos');
            return (await doc.get()).data();
        } catch (err) {
            throw err
        }
    };

};

module.exports = { ContainerFirestore }