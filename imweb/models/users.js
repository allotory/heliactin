/**
 * pet
 * Created by Ellery on 2017/4/8.
 */

const sequelize = require('../db/db');

const Sequelize = require('sequelize');

let Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    nickname: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING(128),
        allowNull: false
    },
    gender: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    avatar: {
        type: Sequelize.STRING(256),
        allowNull: true,
    },
    autograph: {
        type: Sequelize.STRING(128),
        allowNull: true,
    }
}, {
    timestamps: false
});

module.exports = Users;