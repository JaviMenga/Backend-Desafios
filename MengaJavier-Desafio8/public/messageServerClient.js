// Almacenamiento de mensajes

const messagesServerClient = []

const saveMessageServerClient = (message) => {
    messagesServerClient.push(message)
}

const getMessagesServerClient = () => {
    return messagesServerClient
}

module.exports = {
    saveMessageServerClient,
    getMessagesServerClient
}