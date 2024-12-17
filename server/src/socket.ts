import { Server } from "socket.io"
import http from "http"
import { IOServerType } from "./types/sockets";
let io: IOServerType;

export function initSocket(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
  io = new Server(server);
  io.on('connection', (socket) => {
    console.log('a user connected');
  });
}

export function getSocket() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}