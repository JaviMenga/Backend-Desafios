// Almacenamiento de productos

const productsServerClient = []


const saveProductsServerClient = (product) => {
    productsServerClient.push(product)
}

const getProductsServerClient = () => {
    return productsServerClient
}

module.exports = {
    saveProductsServerClient,
    getProductsServerClient
}