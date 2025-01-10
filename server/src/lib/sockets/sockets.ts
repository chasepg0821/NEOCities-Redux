import { Server } from "socket.io"
import http from "http"
import { ClientToServerEvents, InterServerEvents, AppServerType, ServerToClientEvents, SocketData } from "./socketTypes";
import { getClients } from "../clients";
import { addRoomHandlers, addUtilHandlers } from "./socketHandlers";
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

    if (!clients.has(socket.data.uid)) {
      console.log("Client connected:", socket.data.uid, "| Not in room. Terminating.");
      socket.emit("reqError", "Client is not in a room. Terminating connection!");
      socket.disconnect();
    } else {
      socket.data.room = clients.getRoom(socket.data.uid)!;
      console.log("Client connected:", socket.data.uid, " | Joining room: ", socket.data.room);
      socket.join(socket.data.room);
      socket.broadcast.in(socket.data.room).emit("userJoined", socket.data.uid, {
        name: clients.get(socket.data.uid)?.name || "",
        latency: 0
      });
    }

    addUtilHandlers(io, socket);
    addRoomHandlers(io, socket);

    socket.on("disconnect", () => {
      // TODO: check if user was a player in their room. Pause and wait. (INVOLVED: May not need for MVP)
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
          latency: clients.getLatency(uid) || 0
        }
      });
      io.in(roomID).emit("latencies", latencies);
    });
  }, 5000);

  // TODO: add client garbage collection
}

export function getSocketServer() {
  if (!io) {
    throw new Error("Socket server not initialized!");
  }
  return io;
}