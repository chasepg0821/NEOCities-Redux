import { Server } from "socket.io"
import http from "http"
import { ClientToServerEvents, InterServerEvents, AppServerType, ServerToClientEvents, SocketData } from "./socketTypes";
import { getClients } from "../clients";
import { joinRoom, leaveRoom, pong } from "./socketHandlers";
import { getRooms } from "../rooms";
import { forEach } from "lodash";

let io: AppServerType;

export function initSocketServer(server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
  const clients = getClients();
  const rooms = getRooms();

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

    socket.on("joinRoom", (room: string, password?: string) => {
      joinRoom(io, socket, room, password);
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
    // emit a ping to users only in a room, and notify that room of the new pings
    const timestamp = Date.now();
    io.emit("ping", timestamp);
    rooms.getMap().forEach((room, roomID) => {
      const latencies: { [id: string]: { latency: number }} = {}
      forEach(room.getUsers(), (_, uid) => {
        latencies[uid] = {
          latency: clients.getLatency(uid) || -1
        }
      });
      
      io.in(roomID).emit("latencies", latencies);
    });
}, 5000);
}

export function getSocketServer() {
  if (!io) {
    throw new Error("Socket server not initialized!");
  }
  return io;
}