import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const loadedGameData = (socket: AppSocketType) => {
    const room = getRooms().getRoom(socket.data.room);

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    }

    room.setUserLoaded(socket.data.uid, true);

    socket.emit("loadedGameData", socket.data.uid);
    socket.broadcast.emit("loadedGameData", socket.data.uid);
}