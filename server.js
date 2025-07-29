const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

// --- FIX: These lines were missing ---
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// ------------------------------------

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        
        // This special route will be handled by our server to trigger socket events
        if (parsedUrl.pathname === '/api/socket' && req.method === 'POST') {
            // We'll emit the event to all connected clients
            io.emit('update-event', { message: 'Leaderboard has been updated!' });
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Socket event emitted' }));
            return;
        }

        // For all other routes, let Next.js handle it
        handle(req, res, parsedUrl);
    });
  
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log('🔌 A user connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('🔌 A user disconnected:', socket.id);
        });
    });

    httpServer.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});