import { AppServerType, AppSocketType } from "../../socketTypes";
import { assignRole } from "./assignRole";
import { leaveRoom } from "./leaveRoom";

export const addRoomHandlers = (io: AppServerType, socket: AppSocketType) => {
    socket.on("leaveRoom", () => {
        leaveRoom(socket);
    });
    socket.on("assignRole", (role, user) => {
        assignRole(io, socket, role, user);
    })
}
