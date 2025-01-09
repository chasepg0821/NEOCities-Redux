import { getRooms } from "../../../rooms";
import { getClients } from "../../../clients";
import { AppServerType, AppSocketType } from "../../socketTypes";

export const leaveRoom = (io: AppServerType, socket: AppSocketType) => {
    const clients = getClients();
    const rooms = getRooms();

    if (clients.inRoom(socket.data.uid)) {
        // get the users room
        const currRoom = clients.getRoom(socket.data.uid);
        // remove user from the room instance
        rooms.get(currRoom!)?.removeUser(socket.data.uid);
        // remove user from the io room
        socket.leave(clients.getRoom(socket.data.uid)!);
        // notify other clients in the room that a user left
        io.in(currRoom!).emit("userLeft", socket.data.uid)
    }
}