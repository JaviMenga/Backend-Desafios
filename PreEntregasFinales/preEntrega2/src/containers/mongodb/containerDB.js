const mongoose = require('mongoose');

(async() => {
    try {
        const URL = 'mongodb://localhost:27017/ecommerce';
        let rta = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión a MongoDB establecida');

    } catch (err) {
        console.log('error en this.connection de ContainerDB');
    }

})();

class ContainerDB {
    constructor(model) {
        this.model = model;
    };

    async saveInDb(content) {
        try {
            await new this.model(content).save();
            console.log('Productos guardados en la base de datos');

        } catch (err) {
            throw err
        }
    };

    async getContentDb() {
        try {
            let content = await this.model.find();
            return content
        } catch (err) {
            throw err
        }
    };

    async deleteContentDb(filter) {
        try {
            if (filter) {
                await this.model.deleteOne(filter);
                console.log('Producto eliminado de la base de datos');
            } else {
                await this.model.deleteMany({});
            }
        } catch (err) {
            throw err
        }
    };

    async findContentDb(filter, projection) {
        try {
            let result = await this.model.findOne(filter, projection);
            return result
        } catch (err) {
            throw err
        }
    };


    // necesito ver como pasar el body
    //     async UpdateContentDb(filter, newProduct) {
    //         try {
    //             let result = await this.model.findAndUpdate(filter, {update: newProduct}, {new: true});
    //         return result
    //     } catch (err) {
    //         throw err
    //     }
    // };
}

module.exports = { ContainerDB };