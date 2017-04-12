/**
 * signIn
 * Created by Ellery on 2017/3/26.
 */

'use strict';

let JsSHA = require("jssha");
const UserModel = require('../models/users');
const FriendsModel = require('../models/friends');

// 用户登录
let func_signIn = async (ctx, next) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    // console.log(`signin with username: ${username}, password: ${password}`);

    // 生成加密盐
    let shaObj = new JsSHA('SHA-256', 'TEXT');
    shaObj.update(username + password);
    let hash = shaObj.getHash('HEX');

    // 生成加密密码
    shaObj.update(hash + password);
    let encryptPassword = shaObj.getHash('HEX');

    // 查询用户
    let user = await UserModel.findAll({

        include: [{model: FriendsModel, as: 'UserFriends'}],
        where: {
            username: username,
            password: encryptPassword
        }
    });

    // console.log(`find ${users.length} users:`);

    console.log(user);

    // let friends = await FriendsModel.findAll({
    //     include: [{model: UserModel, as: 'UserFriends'}],
    //     where: {
    //         user_id: user.id
    //     }
    // });
    //
    // console.log(friends);

    if (user) {

        // let friends = await

        ctx.response.body = JSON.stringify(user);
    } else {
        ctx.response.body = 'failure';
    }
};


module.exports = {
    'POST /signin': func_signIn
};
