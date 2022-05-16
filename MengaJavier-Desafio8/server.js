// KNEX
const { knexMySql } = require('./options/mariaDB'); // KNEX
const { knexSQLite3 } = require('./options/SQLite3');

// FS
const fs = require('fs');

// EXPRESS
const express = require('express');
const PORT = 8080;
const app = express();
const { getProductsServerClient, saveProductsServerClient } = require('./public/productsServerClient.js');
const { getMessagesServerClient, saveMessageServerClient } = require('./public/messageServerClient.js');

// WEBSOCKET
const { Server: HTTPServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);

// CODIGO PARA ACCEDER A LOS DATOS DEL BODY RECIBIDOS POR PARTE DEL CLIENTE
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ESTABLEZCO EL MOTOR DE PLANTILLA QUE UTILIZARE
app.set('view engine', 'ejs');

// ESTABLEZCO EL DIRECTORIO DONDE SE ENCUENTRAN LOS ARCHIVOS DE LAS PLANTILLAS
app.set('views', './views');
// ESTABLEZCO EL DIRECTORIO DONDE SE ENCUENTRAN LOS ARCHIVOS DE CSS/JS
app.use(express.static('public'));

// ESCUCHO EL SERVIDOR
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
// MANEJO DE ERRORES
httpServer.on('error', err => { console.log(err) });

// TENGO MI CLASE DE PRODUCTS CON SUS RESPECTIVOS METODOS

class ProductsDB {
    constructor(knex, table) {
        this.knex = knex;
        this.table = table;
    }

    async save(object) {
        let table = await this.knex.schema.hasTable(this.table)
            .then((result) => {
                return result;
            })
            .catch(() => {
                console.log('error en dropTableIfExists')
            });
        if (!table) {
            return this.knex.schema.createTable(this.table, (table) => {
                    table.increments('id').primary();
                    table.string('title');
                    table.integer('price');
                    table.string('thumbnail');
                })
                .then(() => {
                    return this.knex(this.table).insert(object)
                        .then((result) => {
                            return result;
                        })
                        .catch((err) => {
                            console.log('error en insert');
                        })
                })
                .catch((err) => {
                    console.log('error en createTable');
                })
        } else {
            return this.knex(this.table).insert(object)
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    throw err;
                })
        }
    }

    async getAll() {
        let table = await this.knex.schema.hasTable(this.table)
            .then((result) => {
                return result;
            })
            .catch(() => {
                console.log('error en dropTableIfExists')
            });
        if (!table) {
            return [];
        } else {
            return this.knex(this.table).select('*')
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log('error en getAll');
                })

        }
    }
};

// TENGO MI CLASE DE MESSAGES CON SUS RESPECTIVOS METODOS

class MessagesDB {
    constructor(knex, table) {
        this.knex = knex;
        this.table = table;
    }
    async save(object) {
        let table = await this.knex.schema.hasTable(this.table)
            .then((result) => {
                return result;
            })
            .catch(() => {
                console.log('error en dropTableIfExists')
            });
        if (!table) {
            return this.knex.schema.createTable(this.table, (table) => {
                    table.string('email');
                    table.string('date');
                    table.string('message');
                })
                .then(() => {
                    return this.knex(this.table).insert(object)
                        .then((result) => {
                            return result;
                        })
                        .catch((err) => {
                            console.log('error en insert1');
                        })
                })
                .catch((err) => {
                    console.log('error en create');
                })
        } else {
            return this.knex(this.table).insert(object)
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log('error en insert2');
                })
        }
    }

    async getAll() {
        let table = await this.knex.schema.hasTable(this.table)
            .then((result) => {
                return result;
            })
            .catch(() => {
                console.log('error en dropTableIfExists')
            });
        if (!table) {
            return [];
        } else {
            return this.knex(this.table).select('*')
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log('error en getAll');
                })

        }
    }

};

// DEFINO MI CLASE 'Products' CON LOS METODOS DE LA CLASE 'ContainerDB'
const Products = new ProductsDB(knexMySql, 'products');

// DEFINO MI CLASE 'Messages' CON LOS METODOS DE LA CLASE 'ContainerDB'
const Messages = new MessagesDB(knexSQLite3, 'messagesServerClient');

// DEFINO MI CLASE 'ProductsServerClient' CON LOS METODOS DE LA CLASE 'ContainerDB'
const ProductsServerClient = new ProductsDB(knexSQLite3, 'productsServerClient');

// RUTAS

app.get('/products', (req, res) => {
    res.render('pages/form', { root: __dirname });
});

io.on('connection', async socket => {
    console.log('Usuario conectado')

    socket.emit('products', await ProductsServerClient.getAll());

    socket.on('getProducts', async data => {
        await ProductsServerClient.save(data);
        let allProducts = await ProductsServerClient.getAll();
        io.sockets.emit('products', allProducts)
    })

    socket.emit('messages', await Messages.getAll())

    socket.on('newMessage', async data => {
        await Messages.save(data)
        let messages = await Messages.getAll()
        io.sockets.emit('messages', messages)
    })


});














app.post('/products', async(req, res) => {
    let newProduct = req.body
    newProduct.price = parseInt(newProduct.price)
    await Products.save(newProduct)
    res.render('pages/form')
});

app.get('/allProducts', async(req, res) => {
    let allProducts = await Products.getAll();
    res.render('pages/products', { products: allProducts });
});