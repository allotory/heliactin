/**
 * application
 * Created by Ellery on 2017/3/26.
 */

'use strict';

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

// 房间用户名单
let userInfos = {};
let userSockets = {};
let groupInfo = {};

// 给 socket.io 添加客户端连接服务器监听事件
io.on('connection', function (socket) {

    // 登录成功后，加入服务器
    socket.on('online', function (user_id, callback) {
        userInfos[user_id] = user_id;
        userSockets[user_id] = socket;
        callback(true);
    });

    // 私聊
    socket.on('privateMessage', function (from, to, msg) {
        if (to in userSockets) {
            console.log(from + ' to ' + to + ':' + msg);
            userSockets[to].emit('receivePrivateMsg', from, msg);
        }
    });

    // 退出私聊
    socket.on('leavePrivateChat', function (from ,to) {
        console.log(from + '退出了与' + to + '私聊');
    });

    let userId, groupId;

    // 接收待加入群组 id
    socket.on('chatGroupId', function (group_id, callback) {
        groupId = group_id;
        callback(true);
    });

    // 加入群组
    socket.on('joinGroup', function (user_id, callback) {
        userId = user_id;

        if (!groupInfo[groupId]) {
            groupInfo[groupId] = [];
        }
        groupInfo[groupId].push(userId);

        // 加入房间
        socket.join(groupId);
        // 通知房间内人员
        callback(true);
        io.to(groupId).emit('sys', userId + '加入了房间', groupInfo[groupId]);
        console.log(userId + '加入了' + groupId);
    });

    // 接收用户消息,发送相应的房间
    socket.on('message', function (msg) {
        // 验证如果用户不在房间内则不给发送
        if (groupInfo[groupId].indexOf(userId) === -1) {
            return false;
        }

        // 向房间所有人发消息，发送者除外
        socket.broadcast.to(groupId).emit('msg', userId, msg);
    });

    socket.on('leaveGroup', function (globalGroup) {
        // 从房间名单中移除
        let index = groupInfo[globalGroup].indexOf(userId);
        if (index !== -1) {
            groupInfo[globalGroup].splice(index, 1);
        }
        // 退出房间
        socket.leave(globalGroup);
        console.log(userId + '退出了' + globalGroup);
    });

    socket.on('disconnect', function () {
        // 从房间名单中移除
        // let index = groupInfo[groupId].indexOf(userId);
        // if (index !== -1) {
        //     groupInfo[groupId].splice(index, 1);
        // }
        //
        // socket.leave(groupId);    // 退出房间
        // io.to(groupId).emit('sys', userId + '退出了房间', groupInfo[groupId]);
        // console.log(userId + '退出了' + groupId);
    });

    // console.log('user connected');//输出客户端连接服务器日志
    //
    // socket.emit('welcome', {text: 'connected'});//发送消息给新连接服务器的客户端
    //
    // //服务器监听客户端提交的昵称,判断是否已经存在,并以回调函数返回true或false告诉客户端昵称是否存在
    // socket.on('name', function (data, callback) {
    //     if (namelist.indexOf(data) === -1) {//昵称不存在
    //         console.log('hehe');
    //         callback(true);//从服务器返回给客户端的回调函数，昵称不存在返回true
    //         namelist.push(data);//存储新添加的昵称
    //         socket.username = data;//用于断开连接时，从列表时删除
    //         console.log('昵称：' + namelist);
    //         io.sockets.emit('usernames', namelist);//把昵称列表广播给所有在线的用户
    //     }
    //     else {
    //         callback(false);//昵称存在，返回客户端为false
    //     }
    //
    // });
    //
    // //服务器监听客户端发送的消息，并把消息广播给所有连接服务器的客户端
    // socket.on('message', function (data) {
    //     socket.broadcast.emit('clientReceiveMessage', {sender: socket.username, message: data});
    // });
    //
    // //当有客户端断开连接时，重新发送昵称列表给所有在线客户端，实现实时更新
    // socket.on('disconnect', function () {
    //     if (!socket.username) return;
    //     if (namelist.indexOf(socket.username) > -1) {//从在线列表删除断开连接的客户昵称
    //         namelist.splice(namelist.indexOf(socket.username), 1);
    //     }
    //     console.log('昵称：' + namelist);
    //     io.sockets.emit('usernames', namelist);//把昵称列表广播给所有在线的用户
    // });
});



console.log('server started at port 3000.');
