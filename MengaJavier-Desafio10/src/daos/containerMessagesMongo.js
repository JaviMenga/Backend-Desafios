const { tr } = require('faker/lib/locales');
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
            let messsages = await this.getAll();
            let id = messsages.length + 1;
            newMessage.author._id = id;
            await this.saveInDb(newMessage);
        } catch (err) {
            console.log('error en save');
        }
    };

}

module.exports = { MessagesDaoMongo }