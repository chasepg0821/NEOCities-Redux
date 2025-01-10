import { getClients } from "../../../clients";
import { getRooms, RoleID, UserID } from "../../../rooms";
import { AppServerType, AppSocketType } from "../../socketTypes";

export const assignRole = (io: AppServerType, socket: AppSocketType, role: RoleID, user: UserID) => {
    const client = getClients().get(socket.data.uid);
    const room = client?.room ? getRooms().get(client.room) : undefined;

    // room exists and the request is from the admin
    if (room && room.getAdmin().id === socket.data.uid) {
        room.assignRole(role, user);
        io.in(room.getID()).emit("assignedRole", role, user);
    // room exists, but request is not from the admin
    } else if (room) {
        socket.emit("permError", "You are not the admin of the room.");
    // room doesn't exist
    } else {
        socket.emit("reqError", "Room could not be found.");
    }
}