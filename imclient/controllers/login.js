/**
 * login
 * Created by Ellery on 2017/3/26.
 */

'use strict'

var func_index = async (ctx, next) => {
    ctx.render('index.html', {
        title: 'login'
    });
};

var func_signIn = async (ctx, next) => {
    var username = ctx.request.body.username || '';
    var password = ctx.request.body.password || '';
    console.log(`signin with username: ${username}, password: ${password}`);

    if (username === 'ellery' && password === '333333') {
        ctx.render('index.html', {
            title: 'Sign In OK',
            name: 'Mr Node'
        });
    } else {
        ctx.response.body = '<h1>login fail!</h1><br><a href="/">try again</a>';
    }
};

module.exports = {
    'GET /': func_index,
    'POST /signin': func_signIn
};
