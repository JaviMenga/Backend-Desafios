const { ContainerMongo } = require('../containers/containerMongo');
const { SessionsModel } = require('../models/sessions');

class SessionsDaoMongo extends ContainerMongo {
    constructor() {
        super(SessionsModel);
    };

    async getAll() {
        try {
            let sessions = await this.getContentDb();
            return sessions;
        } catch (err) {
            console.log('error en getAll Session');
        }
    };

    async delete(id) {
        try {
            await this.deleteOne(id);
        } catch (err) {
            console.log('error en delete Session');
        }
    };

}

module.exports = { SessionsDaoMongo }