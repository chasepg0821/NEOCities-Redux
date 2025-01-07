import { getClients } from "../../../clients";
import { AppServerType, AppSocketType } from "../../socketTypes";

export const joinRoom = (io: AppServerType, socket: AppSocketType, room: string, password?: string) => {
    const clients = getClients();

    if (clients.inRoom(socket.data.uid)) {
        //TODO: handle notifying the room of teammate leaving
        socket.leave(clients.getRoom(socket.data.uid)!);
    }

    socket.join(room);
    socket.emit("joinResponse", true);
    clients.setRoom(socket.data.uid, room);
}