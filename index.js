const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server\n');
});

const wss = new WebSocket.Server({ server });

let onlineUsersCount = 1339; // Khởi tạo số người trực tuyến với giá trị tối thiểu là 1339

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send(JSON.stringify({ onlineUsersCount }));

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        if (message === 'getOnlineUsersCount') {
            ws.send(JSON.stringify({ onlineUsersCount }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(8080, () => {
    console.log('WebSocket server is listening on port 8080');
});

// Logic tăng/giảm số người trực tuyến sau mỗi khoảng thời gian
setInterval(() => {
    const randomChange = Math.random() > 0.5 ? 1 : -1;
    onlineUsersCount += randomChange;
    broadcastOnlineUsersCount();
}, 5000);

function broadcastOnlineUsersCount() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ onlineUsersCount }));
        }
    });
}
