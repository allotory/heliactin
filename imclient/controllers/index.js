/**
 * index
 * Created by Ellery on 2017/4/10.
 */

'use strict';

let func_index = async (ctx, next) => {
    console.log(ctx.state.username + '000000');
    ctx.render('index.html', {
        title: 'Login'
    });
};

module.exports = {
    'GET /': func_index
};