const fs = require('fs')

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
                console.log(productById)
            } else {
                console.log('Null');
            }
        }
    }

    getAll() {
        let json = fs.readFileSync(this.fileName);
        let object = JSON.parse(json);
        console.log(object);
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
}









let Products = new Container('productos.txt');

let product1 = {
    title: 'lápiz',
    price: 100,
    thumbnail: '../multimedia/lapiz.jpg',
};
let product2 = {
    title: 'cartuchera',
    price: 200,
    thumbnail: '../multimedia/cartuchera.jpg'
};
let product3 = {
    title: 'riñonera',
    price: 300,
    thumbnail: '../multimedia/rinonera.jpg'
};


// Products.save(product1);
// Products.save(product2);
// Products.save(product3);
// Products.getById(1);
Products.getAll();
// Products.deleteById(2)
// Products.deleteAll()