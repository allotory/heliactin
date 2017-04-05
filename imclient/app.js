/**
 * application
 * Created by Ellery on 2017/3/26.
 */

'use strict'

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const controller = require('./controller');
const templating = require('./templating');
const staticFiles = require('./staticFiles');

const app = new Koa();

// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    ctx.state.username = 'ellery';
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

let server = app.listen(3000);
let io = require('socket.io').listen(server);

let namelist = [];//用于存储昵称

//给socket.io添加客户端连接服务器监听事件
io.on('connection', function (socket) {
    console.log('user connected');//输出客户端连接服务器日志

    socket.emit('welcome', {text: 'connected'});//发送消息给新连接服务器的客户端

    //服务器监听客户端提交的昵称,判断是否已经存在,并以回调函数返回true或false告诉客户端昵称是否存在
    socket.on('name', function (data, callback) {
        if (namelist.indexOf(data) === -1) {//昵称不存在
            console.log('hehe');
            callback(true);//从服务器返回给客户端的回调函数，昵称不存在返回true
            namelist.push(data);//存储新添加的昵称
            socket.username = data;//用于断开连接时，从列表时删除
            console.log('昵称：' + namelist);
            io.sockets.emit('usernames', namelist);//把昵称列表广播给所有在线的用户
        }
        else {
            callback(false);//昵称存在，返回客户端为false
        }

    });
    //当有客户端断开连接时，重新发送昵称列表给所有在线客户端，实现实时更新
    socket.on('disconnect', function () {
        if (!socket.username) return;
        if (namelist.indexOf(socket.username) > -1) {//从在线列表删除断开连接的客户昵称
            namelist.splice(namelist.indexOf(socket.username), 1);
        }
        console.log('昵称：' + namelist);
        io.sockets.emit('usernames', namelist);//把昵称列表广播给所有在线的用户
    });
});



console.log('server started at port 3000.');
