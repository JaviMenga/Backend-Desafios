// Import classes
const { Sessions } = require('./src/daos/containerSessionsMongo');
const { Products } = require('./src/containers/containerMySql');
const { ProductsServerClient } = require('./src/containers/containerMySql');
const { UsersModel } = require('./src/models/users');

// Import funcions
const { createHash } = require('./src/utils/hashGenerator');
const { validatePass } = require('./src/utils/passValidator');

// Express
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Socket.io
const { Server: HTTPServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HTTPServer(app);
const io = new IOServer(httpServer);

// Sessions
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use('logIn', new LocalStrategy(
    (username, password, callback) => {
        UsersModel.findOne({ username: username }, (err, user) => {
            if (err) {
                console.log('error trying to log in');
                return callback(err);
            } else if (!user) {
                console.log('User not found');
                return callback(null, false);
            }

            if (!validatePass(user, password)) {
                console.log('Invalid Password');
                return callback(null, false)
            }

            return callback(null, user);
        })
    }
));
passport.use('signUp', new LocalStrategy({ passReqToCallback: true },
    (req, username, password, callback) => {
        UsersModel.findOne({ username: username }, (err, user) => {
            if (err) {
                console.log('error trying to sign up');
                return callback(err);
            } else if (user) {
                console.log('User already exists');
                return callback(null, false);
            }

            const newUser = {
                username: req.body.username,
                password: createHash(password),
                address: req.body.address
            }

            UsersModel.create(newUser, (err, userWithId) => {

                if (err) {
                    console.log('Error trying to sign up');
                    return callback(err);
                }

                console.log('signed up with success');
                return callback(null, userWithId)
            })
        })
    }
));
passport.serializeUser((user, callback) => {
    callback(null, user._id)
});
passport.deserializeUser((id, callback) => {
    UsersModel.findById({ _id: id }, callback)
});

// Middlewares App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/ecommerce', ttl: 1000 }),
    secret: 'desafio11',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())


// Views
app.set('view engine', 'ejs');
app.set('views', './views');

// Initialize server
httpServer.listen(8080, () => {
    console.log(`Server on port 8080`);
});
httpServer.on('error', err => { console.log(err) });

// Socket connection
io.on('connection', async socket => {
    socket.emit('products', await ProductsServerClient.getAll());
    socket.on('getProducts', async data => {
        await ProductsServerClient.save(data);
        let allProducts = await ProductsServerClient.getAll();
        io.sockets.emit('products', allProducts)
    });

});

// MiddleWare Routes
// function checkLogged(req, res, next) {
//     if (req.session.logged) {
//         return next();
//     }
//     return res.status(401).render('pages/home');
// };

// Routes

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        let user = req.user;
        res.render('pages/home', { user: user, isUser: true });
    } else {
        res.render('pages/home', { isUser: false })
    }
});

app.post('/login', passport.authenticate('logIn', { failureRedirect: '/' }), (req, res) => {
    if (req.isAuthenticated()) {
        let user = req.user;
        return res.render('pages/form', { user: user, isUser: true });
    } else {
        return res.redirect('/')
    }
})

app.get('/allProducts', async(req, res) => {
    let allProducts = await Products.getAll();
    res.render('pages/products', { products: allProducts });
});

app.get('/products', (req, res) => {
    if (req.isAuthenticated()) {
        let user = req.user
        res.render('pages/form', { user: user, isUser: true });
    } else {
        res.redirect('/');
    }
});

app.post('/products', async(req, res) => {
    const { title, price, thumbnail } = req.body
    let newProduct = { title: title, price: parseInt(price), thumbnail: thumbnail }
    await Products.save(newProduct)
    let user = req.user
    res.render('pages/form', { user: user, isUser: true })
});

app.post('/signUp', passport.authenticate('signUp', { failureRedirect: '/' }), (req, res) => {
    if (req.isAuthenticated()) {
        let user = req.user;
        return res.render('pages/form', { user: user, isUser: true });
    } else {
        return res.redirect('/')
    }


});

app.get('/logout', (req, res) => {
    req.session.destroy();
    setTimeout(() => { res.redirect('/') }, 2000)
});