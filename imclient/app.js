/**
 * application
 * Created by Ellery on 2017/3/26.
 */

'use strict'

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

let staticFiles = require('./staticFiles');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// parse request body
app.use(bodyParser());

// ctx render
const isProduction = process.env.NODE_ENV === 'production';
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

// static file
app.use(staticFiles('/static/', __dirname + '/static'));

// add controllers
app.use(controller());

app.listen(3000);
console.log('server started at port 3000.');
