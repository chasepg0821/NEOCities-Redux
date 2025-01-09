import { AppServerType, AppSocketType } from "../../socketTypes";
import { assignRole } from "./assignRole";
import { joinRoom } from "./joinRoom";
import { leaveRoom } from "./leaveRoom";

export const addRoomHandlers = (io: AppServerType, socket: AppSocketType) => {
    socket.on("joinRoom", (room: string, password?: string) => {
        joinRoom(socket, room, password);
    });
    socket.on("leaveRoom", () => {
        leaveRoom(socket);
    });
    socket.on("assignRole", (role, user) => {
        assignRole(io, socket, role, user);
    })
}
