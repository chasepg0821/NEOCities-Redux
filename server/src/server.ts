import express from "express"
import http from "http"
import path from "path"
import { initSocket } from "./socket"


const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, '../../client/dist')));

// REST endpoint example
app.post('/join', (req, res) => {
  const { userId, roomId } = req.body;
  res.status(200).send({ message: 'Joined room' });
});

// Serve the index.html file for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Initialize Socket.IO
initSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});