/**
 * groups
 * Created by Ellery on 2017/4/9.
 */

const sequelize = require('../db/db');

const Sequelize = require('sequelize');

module.exports = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupname: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: ''
    },
    gavatar: {
        type: Sequelize.STRING(256),
        allowNull: true,
        defaultValue: ''
    },
    gautograph: {
        type: Sequelize.STRING(128),
        allowNull: true,
        defaultValue: ''
    }
}, {
    timestamps: false
});
