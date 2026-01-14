import Server from 'bare-server-node';
import http from 'http';
import nodeStatic from 'node-static';

const bare = new Server('/bare/', '');
const serve = new nodeStatic.Server('Site/');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    // If bare handled it, STOP.
    if (bare.route_request(req, res)) {
        return;
    }

    // Otherwise serve static files ONLY
    req.addListener('end', () => {
        serve.serve(req, res);
    }).resume();
});

server.on('upgrade', (req, socket, head) => {
    if (bare.route_upgrade(req, socket, head)) {
        return;
    }
    socket.end();
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});