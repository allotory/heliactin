/**
 * groups
 * Created by Ellery on 2017/4/9.
 */

const sequelize = require('../db/db');

const Sequelize = require('sequelize');

const GroupMembers = require('./groups_member');

let Groups = sequelize.define('groups', {
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

// group members
Groups.hasMany(GroupMembers, {as: 'GroupMember', foreignKey: 'group_id'});

module.exports = Groups;