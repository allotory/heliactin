/**
 * ws
 * Created by Ellery on 2017/3/27.
 */

const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
    port: 3000
});

wss.on('connection', (ws) => {
    console.log(`[SERVER] connection()`);
    ws.on('message', (message) => {
        console.log(`[SERVER] received: ${message}`);
        ws.send(`ECHO: ${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    })
});