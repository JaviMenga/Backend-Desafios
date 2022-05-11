// FS
const fs = require('fs')

// Express
const express = require('express')
const app = express()
const { Router } = express
const router = Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const multer = require('multer')
const { Console } = require('console')

// Declaro el storage
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
})
let upload = multer({ storage: storage })

// Codigo para que interprete mejor los json que envía el cliente?
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let urlencodedParser = bodyParser.urlencoded({ extended: false })

// Codigo para que la app use los router
app.use('/api/productos', router)

// Codigo para que levante el html
app.use('static', express.static(__dirname + 'public'))


// Server
const server = app.listen(8080, () => { console.log('Server is running on port 8080') })
server.on('error', (err) => { console.log(err) })

// Defino mi clase "Container" de Productos con sus respectivos metodos
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
        let json = fs.readFileSync(this.fileName);
        let object = JSON.parse(json);
        return object
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
// Defino mi clase "Product" con los metodos de la clase "Container"
let Products = new Container('productos.txt');



// Rutas
// ruta para obtener todos los productos
router.get('/', (req, res) => {
    let allProducts = Products.getAll();
    res.json(allProducts);
})

// ruta para obtener un producto según id
router.get('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let foundProduct = Products.getById(id)
    if (foundProduct === undefined) {
        res.send({ error: 'Producto no encontrado' })
    } else {
        res.json(foundProduct)
    }
})

// ruta para agregar un producto según la información que se envía
// NO ME FUNCIONA QUE SE GUARDEN LOS ARCHIVOS EN LA CARPETA UPLOADS
router.post('/', jsonParser, upload.single('thumbnail'), (req, res, next) => {
    let newProduct = req.body;
    Products.save(newProduct);
    res.json(newProduct);
})

// ruta para modificar un producto según id y la información que se envía
router.put('/:id', jsonParser, (req, res) => {
    let id = parseInt(req.params.id);
    let productModified = req.body;
    let foundProduct = Products.getById(id);
    if (foundProduct === undefined) {
        res.send({ error: 'Producto no encontrado' })
    } else {
        (foundProduct).title = productModified.title;
        (foundProduct).price = productModified.price;
        (foundProduct).thumbnail = productModified.thumbnail;
        Products.modifyById(id, foundProduct);
        res.json(foundProduct);
    }
})

// ruta para borrar un producto según id
router.delete('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    Products.deleteById(id);
    res.send('Producto eliminado')
})

// Ruta para levantar HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})