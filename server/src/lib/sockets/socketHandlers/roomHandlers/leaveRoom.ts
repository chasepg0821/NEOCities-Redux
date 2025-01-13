import { forEach } from "lodash";
import { getClients } from "../../../clients";
import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const leaveRoom = (socket: AppSocketType) => {
    const room = getRooms().getRoom(socket.data.room);
    const clients = getClients();

    room?.removeUser(socket.data.uid);
    clients.delete(socket.data.uid);
    socket.disconnect();
}