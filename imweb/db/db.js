/**
 * 统一 Model 的定义
 * Created by Ellery on 2017/4/8.
 */

const Sequelize = require('sequelize');
const config = require('../config');

console.log('init sequelize...');

var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;
