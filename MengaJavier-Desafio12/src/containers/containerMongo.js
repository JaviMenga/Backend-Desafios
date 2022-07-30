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

class ContainerMongo {
    constructor(model) {
        this.model = model;
    };

    async saveInDb(content) {
        try {
            await new this.model(content).save();
        } catch (err) {
            throw err
        }
    };

    async getContentDb(filter) {
        if (filter) {
            try {
                let content = await this.model.findOne(filter);
                return content
            } catch (err) {
                console.log('error en getContentDb');
            }
        } else {
            try {
                let content = await this.model.find(filter);
                return content
            } catch (err) {
                console.log('error en getContentDb');
            }
        }

    };
}

module.exports = { ContainerMongo };