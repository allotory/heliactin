/**
 * index
 * Created by Ellery on 2017/4/10.
 */

'use strict';

let func_index = async (ctx, next) => {
    ctx.render('index.html', {
        title: 'Login'
    });
};

module.exports = {
    'GET /': func_index
};