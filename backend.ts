import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'ws';

const app = express();
const server = createServer(app);
const wss = new Server({ server });

app.use(express.json());

interface ClientState {
    id: string;
    lastPing: number;
}

const activeClients = new Map<string, ClientState>();

wss.on('connection', (ws: Socket, req) => {
    const clientId = generateClientId();
    activeClients.set(clientId, { id: clientId, lastPing: Date.now() });
    
    console.log(`Client connected: ${clientId}`);
    
    ws.on('message', (message: string) => {
        try {
            const data = JSON.parse(message.toString());
            handleClientMessage(ws, clientId, data);
        } catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON payload' }));
        }
    });

    ws.on('close', () => {
        activeClients.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
    });

    ws.send(JSON.stringify({ type: 'connection_ack', clientId }));
});

function handleClientMessage(ws: Socket, clientId: string, data: any) {
    if (data.type === 'ping') {
        const client = activeClients.get(clientId);
        if (client) client.lastPing = Date.now();
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
    } else if (data.type === 'subscribe_metrics') {
        startMetricStream(ws);
    }
}

function startMetricStream(ws: Socket) {
    const interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            const metrics = {
                type: 'metric_update',
                data: {
                    throughput: Math.floor(Math.random() * 50000),
                    latency: Math.random() * 15,
                    timestamp: Date.now()
                }
            };
            ws.send(JSON.stringify(metrics));
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function generateClientId(): string {
    return Math.random().toString(36).substring(2, 15);
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', activeConnections: activeClients.size });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket gateway listening on port ${PORT}`);
});
