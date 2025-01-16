import { getRooms } from "../../../rooms";
import { AppSocketType } from "../..";

export const startGame = (socket: AppSocketType) => {
    const room = getRooms().getRoom(socket.data.room);

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    } else if (room.getAdmin().id !== socket.data.uid) {
        socket.emit("permError", "You are not the admin.");
        return;
    } else if (!room.usersLoaded()) {
        socket.emit("reqError", "All users are not loaded.");
        return;
    } else if (!room.getGame()?.playersReady()) {
        socket.emit("reqError", "All players are not ready.");
        return;
    }

    room.getGame()?.start();
}