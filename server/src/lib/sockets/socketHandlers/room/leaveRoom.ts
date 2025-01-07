import { getClients } from "../../../clients";
import { AppServerType, AppSocketType } from "../../socketTypes";

export const leaveRoom = (io: AppServerType, socket: AppSocketType) => {
    const clients = getClients();
    if (clients.inRoom(socket.data.uid)) {
        // TODO: handle telling the other clients that the teammate left
        socket.leave(clients.getRoom(socket.data.uid)!);
        clients.setRoom(socket.data.uid, undefined);
    }
}