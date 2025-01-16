import { getRooms } from "../../../rooms";
import { AppSocketType } from "../..";

export const toggleReady = (socket: AppSocketType) => {
    const room = getRooms().getRoom(socket.data.room);

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    } else if (!room.getGame()?.isPlayer(socket.data.uid)) {
        socket.emit("permError", "You are not a player or the admin.");
        return;
    }

    room.getGame()?.toggleReady(socket.data.uid);
}