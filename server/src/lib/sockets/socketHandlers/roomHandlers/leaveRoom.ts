import { getClients } from "../../../clients";
import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const leaveRoom = (socket: AppSocketType) => {
    const clients = getClients();
    const rooms = getRooms();

    // remove user from the room instance
    rooms.get(socket.data.room)?.removeUser(socket.data.uid);
    // remove user from the io room
    socket.leave(socket.data.room);
    // notify other clients in the room that a user left
    socket.broadcast.in(socket.data.room).emit("userLeft", socket.data.uid);
    
    clients.delete(socket.data.uid);
    socket.disconnect();
}