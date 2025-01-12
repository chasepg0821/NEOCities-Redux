import { Server } from "socket.io";
import http from "http";
import {
    ClientToServerEvents,
    InterServerEvents,
    AppServerType,
    ServerToClientEvents,
    SocketData
} from "./socketTypes";
import { getClients } from "../clients";
import { addRoomHandlers, addUtilHandlers, addGameHandlers } from "./socketHandlers";
import { getRooms, RoomInstance, RoomStateEnum } from "../rooms";
import { forEach } from "lodash";

let io: AppServerType;

export function initSocketServer(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) {
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
        const client = clients.getClient(socket.data.uid);
        let room: RoomInstance | undefined = undefined;

        if (!client) {
            console.log(
                "Client connected:",
                socket.data.uid,
                "| Not in room. Terminating."
            );
            socket.emit(
                "reqError",
                "Client is not in a room. Terminating connection!"
            );
            socket.disconnect();
        } else {
            socket.data.room = clients.getClient(socket.data.uid)?.room!;
            room = rooms.getRoom(socket.data.room);
            console.log(
                "Client connected:",
                socket.data.uid,
                " | Joining room: ",
                socket.data.room
            );
            socket.join(socket.data.room);
            socket.broadcast
                .in(socket.data.room)
                .emit("userJoined", socket.data.uid, {
                    name: clients.getClient(socket.data.uid)?.name || "",
                    latency: 0,
                    state: room?.getUserState(socket.data.uid) || "waiting",
                });
        }

        addUtilHandlers(socket);
        addRoomHandlers(socket);
        addGameHandlers(socket);

        socket.on("disconnect", () => {
            // TODO: if the room has started and a user left, handle recovery (INVOLVED: NOT MVP)
            // if the room hasn't started, just remove them like they left
            if (room!.getRoomState() === RoomStateEnum.lobby) {
                // remove them from any roles they were assigned to
                forEach(room?.getRoleAssignments(), (u, r) => {
                    if (u === socket.data.uid) {
                        room?.assignRole(parseInt(r), "");
                        socket.broadcast
                            .in(socket.data.room)
                            .emit("assignedRole", parseInt(r), "");
                    }
                });
                // remove user from the room instance
                room?.removeUser(socket.data.uid);
                // remove user from the io room
                socket.leave(socket.data.room);
                // notify other clients in the room that a user left
                socket.broadcast
                    .in(socket.data.room)
                    .emit("userLeft", socket.data.uid);

                clients.delete(socket.data.uid);
                socket.disconnect();
            }
            console.log("Client disconnected:", socket.data.uid);
        });
    });

    setInterval(() => {
        // emit a ping to users only in a room, and notify that room of the new pings
        const timestamp = Date.now();
        io.emit("ping", timestamp);
        rooms.getMap().forEach((room, roomID) => {
            const latencies: { [id: string]: { latency: number } } = {};
            forEach(room.getUsers(), (_, uid) => {
                latencies[uid] = {
                    latency: clients.getClient(uid)?.latency || 0
                };
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
