const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'nation4!',
    host: 'localhost',
    port: 5432,
    database: 'authtest1'
});

module.exports = pool;