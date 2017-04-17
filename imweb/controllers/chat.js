/**
 * index
 * Created by Ellery on 2017/4/10.
 */

'use strict';

const UserModel = require('../models/users');

let func_sender = async (ctx, next) => {
    // 查询用户
    let sender = await UserModel.findOne({
        attributes: ['id', 'username', 'nickname', 'gender', 'avatar', 'autograph'],
        where: {
            id: ctx.request.body.userId
        }
    });

    if (sender) {
        ctx.response.body = JSON.stringify(sender);
    }
};

module.exports = {
    'POST /senderInfo': func_sender
};