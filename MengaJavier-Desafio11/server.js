const { MessagesDaoMongo } = require('./src/daos/containerMessagesMongo');
const { knexMySql } = require('./options/mariaDB');
const { knexSQLite3 } = require('./options/SQLite3');
const { Server: HTTPServer } = require('http');
const { Server: IOServer } = require('socket.io');
const express = require('express');
const PORT = 8080;
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/ecommerce', ttl: 600 }),
    secret: 'desafio11',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.set('views', './views');

httpServer.listen(PORT, () => {

    console.log(`Servidor escuchando en el puerto ${PORT}`);

});
httpServer.on('error', err => { console.log(err) });

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

const Products = new ProductsDB(knexMySql, 'products');
const Messages = new MessagesDaoMongo();
const ProductsServerClient = new ProductsDB(knexSQLite3, 'productsServerClient');

// RUTAS
app.get('/', (req, res) => {
    res.render('pages/home', { root: __dirname });

});
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

    socket.emit('messages', await Messages.getAll());

    socket.on('newMessage', async data => {

        await Messages.save(data)
        let messages = await Messages.getAll()
        io.sockets.emit('messages', messages)

    });

});

app.post('/products', async(req, res) => {
    if (req.body.title && req.body.price && req.body.thumbnail) {
        let newProduct = { title: req.body.title, price: parseInt(req.body.price), thumbnail: req.body.thumbnail }
        await Products.save(newProduct)
        res.render('pages/form')
    } else if (req.body.username) {
        req.session.user = req.body.username;
        req.session.logged = true;
        res.render('pages/form')
    }
});


app.get('/allProducts', async(req, res) => {

    let allProducts = await Products.getAll();
    res.render('pages/products', { products: allProducts });

});