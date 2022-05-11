// Express
const express = require('express');
const PORT = 8080;

// Inicializo mi app Express
const app = express();

// Importo los modulos necesarios
const productsRouter = require('./src/routes/productsRoutes');
const cartsRouter = require('./src/routes/cartsRoutes');

app.use('/api/products', productsRouter);
app.use('/api/cart', cartsRouter);
app.use(express.static('public'));

// Código para que express interprete automáticamente los archivos json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Levanto mi app
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
server.on('err', err => {
    console.log(err);
});