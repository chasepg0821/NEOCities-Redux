import { Server } from "socket.io"
import http from "http"
import { ClientToServerEvents, InterServerEvents, IOServerType, ServerToClientEvents, SocketData } from "./socketTypes";
let io: IOServerType;
let clients: { [id: string]: any } = {};

export function initSocket(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
  io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    socket.data.uid = socket.handshake.auth.uid;
    socket.data.uname = socket.handshake.auth.uname;

    console.log('A client connected:', socket.data.uid, socket.data.uname);

    // Initialize client status
    clients[socket.data.uid] = { latency: null, socketID: socket.id };

    // Handle pong response from the client
    socket.on('pong', (timestamp: number) => {
      const latency = Date.now() - timestamp;
      clients[socket.data.uid].latency = latency;
      console.log(`Latency for ${socket.data.uid}: ${latency} ms`);
    });

    socket.on("joinRoom", (roomID) => {
      console.log(socket.data.uid, roomID);
    });

    socket.on("leaveRoom", () => {
      console.log("Left Room.")
    })

    // Clean up on disconnect
    socket.on('disconnect', () => {
      delete clients[socket.data.uid];
      console.log('Client disconnected:', socket.data.uid);
    });
  });

  setInterval(() => {
    const timestamp = Date.now();
    for (let clientId in clients) {
      io.sockets.sockets.get(clients[clientId].socketID)?.emit('ping', timestamp);
    }
}, 5000);
}

export function getSocket() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}