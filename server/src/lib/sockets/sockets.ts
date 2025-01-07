import { Server } from "socket.io"
import http from "http"
import { ClientToServerEvents, InterServerEvents, AppServerType, ServerToClientEvents, SocketData } from "./socketTypes";
import { getClients } from "../clients";
import { joinRoom, leaveRoom, pong } from "./socketHandlers";

let io: AppServerType;

export function initSocketServer(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
  const clients = getClients();

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

  io.on("connection", (socket) => {
    socket.data.uid = socket.handshake.auth.uid;

    console.log("Client connected:", socket.data.uid);

    // TODO: eventually we need to do garbage collection of clients
    clients.set(socket.data.uid, { 
      latency: undefined, 
      room: undefined, 
      name: socket.handshake.auth.uname 
    });

    socket.on("pong", (timestamp: number) => {
      pong(socket, timestamp);
    });

    socket.on("joinRoom", (room: string) => {
      joinRoom(io, socket, room);
    });

    socket.on("leaveRoom", () => {
      leaveRoom(io, socket);
    })

    socket.on("disconnect", () => {
      // TODO: eventually we need to do garbage collection of clients
      // getClients().delete(socket.data.uid);
      console.log("Client disconnected:", socket.data.uid);
    });
  });

  setInterval(() => {
    const timestamp = Date.now();
    io.emit("ping", timestamp);
}, 5000);
}

export function getSocketServer() {
  if (!io) {
    throw new Error("Socket server not initialized!");
  }
  return io;
}