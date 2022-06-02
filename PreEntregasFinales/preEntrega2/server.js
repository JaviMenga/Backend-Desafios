// Express
const express = require('express');
const PORT = 8080;

// Inicializo mi app Express
const app = express();

// Importo los modulos necesarios
const productsRouter = require('./src/routes/firestore/productsRoutesFirestore');
const cartsRouter = require('./src/routes/firestore/cartsRoutesFirestore');
// const productsRouter = require('./src/routes/mongodb/productsRoutesDB');
// const productsRouter = require('./src/routes/file/productsRoutes');
// const cartsRouter = require('./src/routes/file/cartsRoutes');
// const cartsRouter = require('./src/routes/mongodb/cartsRoutesDB');

app.use('/api/products', productsRouter);
app.use('/api/cart', cartsRouter);
app.use(express.static('public'));

// Levanto mi app
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
server.on('err', err => {
    console.log(err);
});