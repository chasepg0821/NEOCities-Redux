import { AppSocketType } from "../../socketTypes";
import { assignRole } from "./assignRole";
import { leaveRoom } from "./leaveRoom";
import { stageGame } from "./stageRoom";

export const addRoomHandlers = (socket: AppSocketType) => {
    socket.on("leaveRoom", () => leaveRoom(socket));
    socket.on("assignRole", (role, user) => assignRole(socket, role, user));
    socket.on("stageGame", () => stageGame(socket));
}
