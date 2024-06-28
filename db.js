const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    'bot_stitch',
    'root',
    'root',
    {
        host: '79.141.71.146',
        port: '5432',
        dialect: 'postgres'
    }
)