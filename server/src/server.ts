import express from "express"
import http from "http"
import path from "path"
import cors from "cors"

import { initSocketServer } from "./lib/sockets/sockets"
import { router } from "./lib/routes"
import { initClients } from "./lib/clients"

const app = express();
const server = http.createServer(app);

initClients();
initSocketServer(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// REST endpoint example
app.use('/api', router);

// Serve the index.html file for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});