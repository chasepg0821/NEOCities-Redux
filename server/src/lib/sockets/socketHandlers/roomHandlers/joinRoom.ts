import { getRooms } from "../../../rooms";
import { getClients } from "../../../clients";
import { AppServerType, AppSocketType } from "../../socketTypes";

export const joinRoom = (io: AppServerType, socket: AppSocketType, room: string, password?: string) => {
    const clients = getClients();
    const rooms = getRooms();

    // if the room doesn't exist respond with failure and return
    if (!rooms.has(room)) {
        socket.emit("joinResponse", false, `Room-${room} does not exist.`)
        return;
    }

    // if they are in another room
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

    // add user to room instance and update client session
    rooms.get(room)!.addUser(socket.data.uid, {
        name: clients.getName(socket.data.uid) || '',
        latency: clients.getLatency(socket.data.uid) || 0
    });
    clients.setRoom(socket.data.uid, room);
    // add socket to the io room
    socket.join(room);
    // notify others in the room of the new user
    socket.broadcast.in(room).emit("userJoined", socket.data.uid, {
        name: clients.getName(socket.data.uid) || '',
        latency: clients.getLatency(socket.data.uid) || 0
    });
    // notify the client that they joined the room
    socket.emit("joinResponse", true, rooms.get(room)!.getLobbyData());
}