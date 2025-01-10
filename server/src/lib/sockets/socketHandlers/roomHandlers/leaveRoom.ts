import { forEach } from "lodash";
import { getClients } from "../../../clients";
import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const leaveRoom = (socket: AppSocketType) => {
    const room = getRooms().get(socket.data.room);

    // remove them from any roles they were assigned to
    forEach(room?.getRoleAssignments(), (u, r) => {
        if (u === socket.data.uid) {
            room?.assignRole(parseInt(r), "");
            socket.broadcast.in(socket.data.room).emit("assignedRole", parseInt(r), "");
        }
    });
    // remove user from the room instance
    room?.removeUser(socket.data.uid);
    // remove user from the io room
    socket.leave(socket.data.room);
    // notify other clients in the room that a user left
    socket.broadcast.in(socket.data.room).emit("userLeft", socket.data.uid);
    
    getClients().delete(socket.data.uid);
    socket.disconnect();
}