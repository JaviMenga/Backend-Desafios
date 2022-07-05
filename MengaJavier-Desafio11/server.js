const { MessagesDaoMongo } = require('./src/daos/containerMessagesMongo');
const { SessionsDaoMongo } = require('./src/daos/containerSessionsMongo');
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
const Sessions = new SessionsDaoMongo();

// RUTAS

io.on('connection', async socket => {
    // funciona bien
    socket.emit('products', await ProductsServerClient.getAll());
    // funciona bien
    socket.on('getProducts', async data => {
        await ProductsServerClient.save(data);
        let allProducts = await ProductsServerClient.getAll();
        io.sockets.emit('products', allProducts)
    });
    // funciona bien
    socket.emit('messages', await Messages.getAll());
    // funciona bien
    socket.on('newMessage', async data => {
        await Messages.save(data)
        let messages = await Messages.getAll()
        io.sockets.emit('messages', messages)
    });


    // cada vez que un usuario se conecta, lee la info que hay en la clave "login". Si no hay info, no va a enviar nada.
    socket.emit('login', await Sessions.getAll());

});

// MIDDLEWARE

// funciona bien
function checkLogged(req, res, next) {
    if (req.session.logged) {
        return next();
    }
    return res.status(401).send('You are not logged')
};

// funciona bien
app.get('/', (req, res) => {
    res.render('pages/home', { root: __dirname });
});

// funciona bien
app.get('/products', checkLogged, (req, res) => {
    res.render('pages/form', { root: __dirname });
});

// funciona bien
app.get('/allProducts', async(req, res) => {
    let allProducts = await Products.getAll();
    res.render('pages/products', { products: allProducts });
});

// funciona bien
app.post('/login', async(req, res) => {
    if (req.body.username) {
        req.session.user = req.body.username;
        req.session.logged = true;
    } else {
        req.session.logged = false;
    }
    res.render('pages/form')
});

// funciona bien
app.post('/products', checkLogged, async(req, res) => {
    let newProduct = { title: req.body.title, price: parseInt(req.body.price), thumbnail: req.body.thumbnail }
    await Products.save(newProduct)
    res.render('pages/form')
});

// Aquí entro cuando presiono el botón "logout" y lo que hace es destruir la sessión y renderizar nuevamente al inicio del login
app.get('/logout', (req, res) => {
    req.session.destroy();
    setTimeout(() => { res.render('pages/form', { root: __dirname }) }, 2000)
});