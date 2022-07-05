const knexSQLite3 = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/mydb.sqlite'
    },
    useNullAsDefault: true
});

module.exports = { knexSQLite3 };