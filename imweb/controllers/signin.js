/**
 * signIn
 * Created by Ellery on 2017/3/26.
 */

'use strict';

let JsSHA = require("jssha");
const UserModel = require('../models/users');
const FriendsModel = require('../models/friends');
const GroupsModel = require('../models/groups');
const GroupMembersModel = require('../models/groups_member');

// 用户登录
let func_signIn = async (ctx, next) => {

    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    // 生成加密盐
    let shaObj = new JsSHA('SHA-256', 'TEXT');
    shaObj.update(username + password);
    let hash = shaObj.getHash('HEX');

    // 生成加密密码
    shaObj.update(hash + password);
    let encryptPassword = shaObj.getHash('HEX');

    // 查询用户
    let user = await UserModel.findOne({
        attributes: ['id', 'username', 'nickname', 'gender', 'avatar', 'autograph'],
        where: {
            username: username,
            password: encryptPassword
        }
    });

    // 查询全部好友
    let friends = await FriendsModel.findAll({
        where: {
            user_id: user.id
        }
    });

    // 全部好友 id
    let friendsList = [];
    friends.forEach(function (friend) {
        friendsList.push(friend.friends_id);
    });

    let friendUsers = await UserModel.findAll({
        attributes: ['id', 'username', 'nickname', 'gender', 'avatar', 'autograph'],
        where: {
            id: friendsList
        }
    });

    // 全部当前参加组
    let groupMembers = await GroupMembersModel.findAll({
        where: {
            group_member_id: user.id
        }
    });
    let groupsList = [];
    groupMembers.forEach(function (groupMember) {
        groupsList.push(groupMember.group_id);
    });

    let groups = await GroupsModel.findAll({
        where: {
            id: groupsList
        }
    });

    // 当前用户及其好友列表
    let userObj = {};
    userObj.user = user;
    userObj.friends = friendUsers;
    userObj.groups = groups;

    if (user) {
        ctx.response.body = JSON.stringify(userObj);
    } else {
        ctx.response.body = 'failure';
    }
};


module.exports = {
    'POST /signin': func_signIn
};
