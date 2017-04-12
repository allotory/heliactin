/**
 * group members
 * Created by Ellery on 2017/4/9.
 */

const sequelize = require('../db/db');

const Sequelize = require('sequelize');

let GroupMembers = sequelize.define('group_members', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = GroupMembers;