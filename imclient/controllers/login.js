/**
 * login
 * Created by Ellery on 2017/3/26.
 */

'use strict'

var func_index = async (ctx, next) => {
    console.log(ctx.state.username + '000000');
    ctx.render('index.html', {
        title: 'Login'
    });
};

var func_signIn = async (ctx, next) => {
    var username = ctx.request.body.username || '';
    var password = ctx.request.body.password || '';
    console.log(`signin with username: ${username}, password: ${password}`);

    if (username === 'e' && password === 'e') {
        ctx.render('index.html', {
            title: 'Index',
            name: 'Mr Noee'
        });
    } else {
        ctx.response.body = '<h1>login fail!</h1><br><a href="/">try again</a>';
    }
};


module.exports = {
    'GET /': func_index,
    'POST /signin': func_signIn
};
