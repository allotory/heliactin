/**
 * signup
 * Created by Ellery on 2017/4/9.
 */

'use strict';

let jsSHA = require("jssha");
const UserModel = require('../models/users');

let func_signUp = async (ctx, next) => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;

    console.log(`signup with username: ${username}, password: ${password}`);

    let shaObj = new jsSHA('SHA-256', 'TEXT');
    shaObj.update(username + password);
    let hash = shaObj.getHash('HEX');

    shaObj.update(hash + password);
    let encryPassword = shaObj.getHash('HEX');

    console.log(encryPassword);

    (async () => {
        var ellery = await UserModel.create({
            username: username,
            nickname: username,
            password: encryPassword,
            salt: hash,
            gender: 0,
            avatar: '',
            autograph: '',
        });
        console.log('created: ' + JSON.stringify(ellery));
    })();

    ctx.response.body = 'success';
};

module.exports = {
    'POST /signup': func_signUp
};
