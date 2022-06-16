// CONTAINERS
const { MessagesDaoMongo } = require('./src/daos/containerMessagesMongo');

// FAKER
const faker = require('faker');
faker.locale = 'es';

// KNEX
const { knexMySql } = require('./options/mariaDB');
const { knexSQLite3 } = require('./options/SQLite3');

// EXPRESS
const express = require('express');
const PORT = 8080;
const app = express();

// WEBSOCKET
const { Server: HTTPServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);

// CODIGO PARA ACCEDER A LOS DATOS DEL BODY RECIBIDOS POR PARTE DEL CLIENTE
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ESTABLEZCO EL MOTOR DE PLANTILLA QUE UTILIZARE
app.set('view engine', 'ejs');
app.set('views', './views');

// ESTABLEZCO EL DIRECTORIO DONDE SE ENCUENTRAN LOS ARCHIVOS DE CSS/JS
app.use(express.static('public'));

// ESCUCHO EL SERVIDOR Y MANEJO DE ERRORES
httpServer.listen(PORT, () => {

    console.log(`Servidor escuchando en el puerto ${PORT}`);

});
httpServer.on('error', err => { console.log(err) });

// TENGO MI CLASE CON SUS RESPECTIVOS METODOS
class ProductsDB {

    constructor(knex, table) {

        this.knex = knex;
        this.table = table;

    }

    async save(object) {

        console.log(this.table);

        let table = await this.knex.schema.hasTable(this.table)
            .then((result) => {

                return result;

            })
            .catch(() => {

                console.log('error en dropTableIfExists de ProductsDB.save')

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

                    console.log('error en createTable en ProductsDB.save');

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

                console.log('error en dropTableIfExists en ProductsDB.getAll')

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

// DEFINO MIS CLASES
const Products = new ProductsDB(knexMySql, 'products');
const Messages = new MessagesDaoMongo();
const ProductsServerClient = new ProductsDB(knexSQLite3, 'productsServerClient');

// NORMALIZR
const { schema, normalize, denormalize } = require('normalizr');
const util = require('util');

function print(obj) {
    console.log(util.inspect(obj, false, 12, true));
    console.log(JSON.stringify(obj).length);
};














// RUTAS
app.get('/products', (req, res) => {
    res.render('pages/form', { root: __dirname });

});

io.on('connection', async socket => {

    socket.emit('products', await ProductsServerClient.getAll());

    socket.on('getProducts', async data => {

        await ProductsServerClient.save(data);
        let allProducts = await ProductsServerClient.getAll();
        io.sockets.emit('products', allProducts)

    });

    // NORMALIZAR
    let messages = await Messages.getAll()
    console.log(messages);

    const authorSchema = new schema.Entity('author', { idAttribute: 'email' });
    const messageSchema = new schema.Entity('text', {
        id: 'messages',
        author: authorSchema
    });
    // const messagesSchema = new schema.Entity('messages', {
    //     author: authorSchema
    // })

    const messagesNormalized = normalize(messages, messageSchema);
    print(messagesNormalized);




    socket.emit('messages', await Messages.getAll());

    socket.on('newMessage', async data => {

        await Messages.save(data)
        let messages = await Messages.getAll()
        io.sockets.emit('messages', messages)

    });

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

app.get('/products-test', async(req, res) => {

    let productsTest = [];
    for (let i = 0; i < 5; i++) {

        let productTest = { title: faker.commerce.product(), price: faker.datatype.number(), thumbnail: faker.image.imageUrl() }
        productsTest.push(productTest);

    };
    res.render('pages/products-test', { products: productsTest })

});