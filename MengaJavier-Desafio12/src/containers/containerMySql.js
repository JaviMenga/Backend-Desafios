const { knexMySql } = require('../../options/mariaDB');
const { knexSQLite3 } = require('../../options/SQLite3');

class ProductsMySql {
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
                console.log('error on dropTableIfExists of ProductsMySql.save')
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
                            console.log('error on insert');
                        })
                })
                .catch((err) => {
                    console.log('error on createTable of ProductsMySql.save');
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
                console.log('error on dropTableIfExists of ProductsMySql.getAll')
            });
        if (!table) {
            return [];
        } else {
            return this.knex(this.table).select('*')
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    console.log('error on getAll');
                })
        }
    }
};

const Products = new ProductsMySql(knexMySql, 'products');
const ProductsServerClient = new ProductsMySql(knexSQLite3, 'productsServerClient');

module.exports = { Products, ProductsServerClient };