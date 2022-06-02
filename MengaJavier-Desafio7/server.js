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
class Container {
    constructor(fileName) {
        this.fileName = fileName;
    }

    save(object) {
        if (!fs.existsSync(this.fileName)) {
            object.id = 1;
            let json = JSON.stringify([object]);
            fs.writeFileSync(this.fileName, json);
            console.log(object.id)
        } else {
            let json = fs.readFileSync(this.fileName, 'utf-8');
            let data = JSON.parse(json);
            if (data.length > 0) {
                object.id = data[data.length - 1].id + 1;
                data.push(object);
                let json2 = JSON.stringify(data);
                fs.writeFileSync(this.fileName, json2);
                console.log(object.id)
            } else {
                object.id = 1;
                let json = JSON.stringify([object]);
                fs.writeFileSync(this.fileName, json);
                console.log(object.id)
            }
        }

    }

    getById(number) {
        if (fs.existsSync(this.fileName)) {
            let json = fs.readFileSync(this.fileName, 'utf-8');
            let data = JSON.parse(json);
            if (data.length > 0) {
                let productById = data.find(x => x.id === number);
                return productById
                    // console.log(productById)
            } else {
                console.log('Null')
            }
        }
    }

    getAll() {
        if (!fs.existsSync(this.fileName)) {
            return [];
        } else {
            let json = fs.readFileSync(this.fileName);
            let object = JSON.parse(json);
            return object
        }
    }

    deleteById(number) {
        let json = fs.readFileSync(this.fileName);
        let object = JSON.parse(json);
        object.splice([number - 1], 1);
        let json2 = JSON.stringify(object);
        fs.writeFileSync(this.fileName, json2);
    }

    deleteAll() {
        let json = fs.readFileSync(this.fileName);
        let object = JSON.parse(json);
        object = [];
        let json2 = JSON.stringify(object);
        fs.writeFileSync(this.fileName, json2);
    }

    modifyById(number, object) {
        let json = fs.readFileSync(this.fileName, 'utf-8');
        let data = JSON.parse(json);
        data[number - 1] = object;
        let json2 = JSON.stringify(data);
        fs.writeFileSync(this.fileName, json2);

    }
}

// DEFINO MI CLASE 'Products' CON LOS METODOS DE LA CLASE 'Container'
let Products = new Container('productos.txt');

// RUTAS
app.get('/products', (req, res) => {
    res.render('pages/form', { root: __dirname });
});

io.on('connection', socket => {
    console.log('Usuario conectado')

    socket.emit('products', Products.getAll())

    socket.on('getProducts', data => {
        saveProductsServerClient(data)
        const products = getProductsServerClient()
        io.sockets.emit('products', products)
    })

    socket.emit('messages', getMessagesServerClient())

    socket.on('newMessage', data => {
        saveMessageServerClient(data)
        const messages = getMessagesServerClient()
        io.sockets.emit('messages', messages)
    })


});


app.post('/products', (req, res) => {
    let newProduct = req.body
    newProduct.price = parseInt(newProduct.price)
    Products.save(newProduct);
    res.render('pages/form')
});

app.get('/allProducts', (req, res) => {
    res.render('pages/products', { products: Products.getAll() });
});