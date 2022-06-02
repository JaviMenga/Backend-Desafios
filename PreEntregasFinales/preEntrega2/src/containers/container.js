const fs = require('fs');

class Container {
    constructor(fileName) {
        this.fileName = fileName;
    }

    saveInFile(content) {
        fs.writeFileSync(this.fileName, JSON.stringify(content));
    }

    getContentFile() {
        let content = [];
        if (!fs.existsSync(this.fileName)) {
            this.saveInFile(content);
            console.log(`Creación del archivo ${this.fileName}`);
        } else {
            let file = fs.readFileSync(this.fileName, 'utf-8');
            content = JSON.parse(file);
        }
        return content;
    }

}

module.exports = { Container };