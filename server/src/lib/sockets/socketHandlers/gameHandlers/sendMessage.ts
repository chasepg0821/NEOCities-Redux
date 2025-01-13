import { getClients } from "../../../clients";
import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const sendMessage = (socket: AppSocketType, text: string) => {
    const client = getClients().getClient(socket.data.uid);
    const room = client?.room ? getRooms().getRoom(client.room) : undefined;

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    } else if (!(room.getAdmin().id === socket.data.uid || room.getGame()?.isPlayer(socket.data.uid))) {
        socket.emit("permError", "You are not a player or the admin.");
        return;
    }

    room.getGame()?.sendMessage(socket.data.uid, text);
};