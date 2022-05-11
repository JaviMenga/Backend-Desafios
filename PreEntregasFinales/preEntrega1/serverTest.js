// // // Express
// // const express = require('express');
// // const PORT = 8080;

// // Router
// const { Router } = express;
// const routerProducts = Router();
// const routerCart = Router();

// FileSystem
// const fs = require('fs');

// Inicializo mi app Express
// const app = express();
// app.use('/products', productsRouter);
// app.use('/cart', routerCart);
// app.use(express.static('public'));

// // Código para que express interprete automáticamente los archivos json
// const bodyParser = require('body-parser')
// const jsonParser = bodyParser.json()
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Levanto mi app
// const server = app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
// server.on('err', err => {
//     console.log(err);
// });

// Clases
// class Product {
//     constructor(fileName) {
//         this.fileName = fileName;
//     }

//     save(object) {
//         if (!fs.existsSync(this.fileName)) {
//             object.id = 1;
//             let json = JSON.stringify([object]);
//             fs.writeFileSync(this.fileName, json);
//             console.log(object.id)
//         } else {
//             let json = fs.readFileSync(this.fileName, 'utf-8');
//             let data = JSON.parse(json);
//             if (data.length > 0) {
//                 object.id = data[data.length - 1].id + 1;
//                 data.push(object);
//                 let json2 = JSON.stringify(data);
//                 fs.writeFileSync(this.fileName, json2);
//                 console.log(object.id)
//             } else {
//                 object.id = 1;
//                 let json = JSON.stringify([object]);
//                 fs.writeFileSync(this.fileName, json);
//                 console.log(object.id)
//             }
//         }

//     }

//     getById(number) {
//         if (fs.existsSync(this.fileName)) {
//             let json = fs.readFileSync(this.fileName, 'utf-8');
//             let data = JSON.parse(json);
//             if (data.length > 0) {
//                 let productById = data.find(x => x.id === number);
//                 return productById
//             } else {
//                 return 'Product not found'
//             }
//         }
//     }

//     getAll() {
//         let json = fs.readFileSync(this.fileName);
//         let object = JSON.parse(json);
//         return object;
//     }

//     deleteById(number) {
//         let json = fs.readFileSync(this.fileName);
//         let object = JSON.parse(json);
//         object.splice([number - 1], 1);
//         let json2 = JSON.stringify(object);
//         fs.writeFileSync(this.fileName, json2);
//     }

//     deleteAll() {
//         let json = fs.readFileSync(this.fileName);
//         let object = JSON.parse(json);
//         object = [];
//         let json2 = JSON.stringify(object);
//         fs.writeFileSync(this.fileName, json2);
//     }

//     modifyById(number, object) {
//         let json = fs.readFileSync(this.fileName, 'utf-8');
//         let data = JSON.parse(json);
//         data[number - 1] = object;
//         let json2 = JSON.stringify(data);
//         fs.writeFileSync(this.fileName, json2);
//     }
// };
// let Products = new Product('./src/data/products.txt');

class Cart {
    constructor(fileName) {
        this.fileName = fileName;
    }

    // VER COMO HACER PARA QUE ME ENVÍE EL ID DEL CARRITO SIN HARDCODEARLO
    createCart() {
        fs.writeFileSync(this.fileName, '[]');
        let idCart = 1;
        return idCart;

    }

    deleteCart() {
        if (!fs.existsSync(this.fileName)) {
            return 'Cart not found';
        } else {
            fs.unlinkSync(this.fileName);
        }

    }
}
// save(object) {
//     if (!fs.existsSync(this.fileName)) {
//         object.id = 1;
//         let json = JSON.stringify([object]);
//         fs.writeFileSync(this.fileName, json);
//         console.log(object.id)
//     } else {
//         let json = fs.readFileSync(this.fileName, 'utf-8');
//         let data = JSON.parse(json);
//         if (data.length > 0) {
//             object.id = data[data.length - 1].id + 1;
//             data.push(object);
//             let json2 = JSON.stringify(data);
//             fs.writeFileSync(this.fileName, json2);
//             console.log(object.id)
//         } else {
//             object.id = 1;
//             let json = JSON.stringify([object]);
//             fs.writeFileSync(this.fileName, json);
//             console.log(object.id)
//         }
//     }

// }

// getById(number) {
//     if (fs.existsSync(this.fileName)) {
//         let json = fs.readFileSync(this.fileName, 'utf-8');
//         let data = JSON.parse(json);
//         if (data.length > 0) {
//             let productById = data.find(x => x.id === number);
//             return productById
//         } else {
//             return 'Product not found'
//         }
//     }
// }

// getAll() {
//     let json = fs.readFileSync(this.fileName);
//     let object = JSON.parse(json);
//     return object;
// }

// deleteById(number) {
//     let json = fs.readFileSync(this.fileName);
//     let object = JSON.parse(json);
//     object.splice([number - 1], 1);
//     let json2 = JSON.stringify(object);
//     fs.writeFileSync(this.fileName, json2);
// }

// modifyById(number, object) {
//     let json = fs.readFileSync(this.fileName, 'utf-8');
//     let data = JSON.parse(json);
//     data[number - 1] = object;
//     let json2 = JSON.stringify(data);
//     fs.writeFileSync(this.fileName, json2);
// }
// };
// // VER COMO HACER PARA QUE ITERE EL NUMERO EN EL NOMBRE
// let Carts = new Cart('./src/data/cart_1.txt');

// // Establezco mis ruta para PRODUCTS
// // productsRouter.get('/:id?', (req, res) => {
// //     if (req.params.id) {
// //         let productFoud = Products.getById(parseInt(req.params.id));
// //         if (productFoud) {
// //             res.send(productFoud);
// //         } else {
// //             res.send('Product not found');
// //         };
// //     } else {
// //         let allProducts = Products.getAll();
// //         res.json(allProducts);
// //     };
// // });

// // productsRouter.post('/', jsonParser, (req, res) => {
// //     Products.save(req.body);
// //     let allProducts = Products.getAll();
// //     res.json(allProducts)
// // });

// // productsRouter.put('/:id', jsonParser, (req, res) => {
// //     let id = parseInt(req.params.id);
// //     let productModified = req.body;
// //     let foundProduct = Products.getById(id);
// //     if (foundProduct === undefined) {
// //         res.send({ error: 'Product not found' })
// //     } else {
// //         foundProduct.timestamp = productModified.timestamp;
// //         foundProduct.name = productModified.name;
// //         foundProduct.description = productModified.description;
// //         foundProduct.code = productModified.code;
// //         foundProduct.url = productModified.url;
// //         foundProduct.price = productModified.price;
// //         foundProduct.stock = productModified.stock;
// //         Products.modifyById(id, foundProduct);
// //         res.json(foundProduct);
// //     }
// // });

// // productsRouter.delete('/:id', (req, res) => {
// //     let id = parseInt(req.params.id);
// //     Products.deleteById(id);
// //     res.send('Product deleted');
// // })

// // Establezco mi ruta origen CART
// routerCart.post('/', (req, res) => {
//     let idCart = Carts.createCart();
//     res.json(`The ID of your Cart is ${idCart}`);
// });

// routerCart.delete('/', (req, res) => {
//     Carts.deleteCart()
//     res.json('Your Cart has been deleted');
// });