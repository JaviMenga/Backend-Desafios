const { ContainerMongo } = require('../containers/containerMongo');
const { MessagesModel } = require('../models/messages');

class MessagesDaoMongo extends ContainerMongo {
    constructor() {
        super(MessagesModel);
    };

    async getAll() {
        try {
            let messages = await this.getContentDb();
            return messages;
        } catch (err) {
            console.log('error en getAll');
        }
    };

    async save(newMessage) {
        try {
            await this.saveInDb(newMessage);
        } catch (err) {
            console.log('error en save');
        }
    };

}

module.exports = { MessagesDaoMongo }