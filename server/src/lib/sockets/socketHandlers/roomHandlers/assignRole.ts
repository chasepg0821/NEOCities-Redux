import { getClients } from "../../../clients";
import { getRooms, RoleID, UserID } from "../../../rooms";
import { AppServerType, AppSocketType } from "../../socketTypes";

export const assignRole = (socket: AppSocketType, role: RoleID, user: UserID) => {
    const client = getClients().getClient(socket.data.uid);
    const room = client?.room ? getRooms().getRoom(client.room) : undefined;

    // room exists and the request is from the admin
    if (room && room.getAdmin().id === socket.data.uid) {
        room.assignRole(role, user);
        socket.emit("assignedRole", role, user);
        socket.broadcast.in(socket.data.room).emit("assignedRole", role, user);
    // room exists, but request is not from the admin
    } else if (room) {
        socket.emit("permError", "You are not the admin of the room.");
    // room doesn't exist
    } else {
        socket.emit("reqError", "Room could not be found.");
    }
}