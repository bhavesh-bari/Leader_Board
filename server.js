const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
// --- CHANGES FOR DEPLOYMENT ---
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;
// ------------------------------

const app = next({ dev }); // hostname and port are not needed here
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        
        if (parsedUrl.pathname === '/api/socket' && req.method === 'POST') {
            io.emit('update-event', { message: 'Leaderboard has been updated!' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Socket event emitted' }));
            return;
        }

        handle(req, res, parsedUrl);
    });
  
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('🔌 A user connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('🔌 A user disconnected:', socket.id);
        });
    });

    httpServer.listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});