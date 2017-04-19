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
    console.log(`[IM] Request process: ${ctx.request.method} ${ctx.request.url}`);
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
            console.log('[IM] Private message info: ' + from + ' to ' + to + ':' + msg);
            userSockets[to].emit('receivePrivateMsg', from, msg);
        }
    });

    // 退出私聊
    socket.on('leavePrivateChat', function (from ,to) {
        console.log('[IM] Leave Private chat info: ' + from + '退出了与' + to + '私聊');
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
        console.log('[IM] Join group info: ' + userId + '加入了' + groupId);
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
        console.log('[IM] Leave group info: ' + userId + '退出了' + globalGroup);
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
        console.log('[IM] Disconnect info: ' + userId + '退出了' + groupId);
    });

});

console.log('[IM] Server info: Server started at port 3000.');
