/**
 * 用户注册
 * Created by Ellery on 2017/4/9.
 */

'use strict';

const JsSHA = require("jssha");
const UserModel = require('../models/users');

let func_signUp = async (ctx, next) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    // console.log(`signup with username: ${username}, password: ${password}`);

    // 生成加密盐
    let shaObj = new JsSHA('SHA-256', 'TEXT');
    shaObj.update(username + password);
    let hash = shaObj.getHash('HEX');

    // 生成加密密码
    shaObj.update(hash + password);
    let encryptPassword = shaObj.getHash('HEX');

    // console.log(encryptPassword);

    // insert data
    let ellery = await UserModel.create({
        username: username,
        nickname: username,
        password: encryptPassword,
        salt: hash,
        gender: 0,
        avatar: '../static/css/images/index.png',
        autograph: '',
    });
    // console.log('created: ' + JSON.stringify(ellery));

    ctx.response.body = 'success';
};

module.exports = {
    'POST /signup': func_signUp
};
