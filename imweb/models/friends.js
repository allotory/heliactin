/**
 * friends
 * Created by Ellery on 2017/4/9.
 */

const sequelize = require('../db/db');

const Sequelize = require('sequelize');

let Friends = sequelize.define('friends', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    friends_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});


module.exports = Friends;
