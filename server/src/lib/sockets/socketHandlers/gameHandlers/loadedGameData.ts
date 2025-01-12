import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const loadedGameData = (socket: AppSocketType) => {
    const room = getRooms().get(socket.data.room);

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    }

    room.setUserState(socket.data.uid, "loaded");
    if (room.getGame()?.isPlayer(socket.data.uid)) room.getGame()?.setPlayerState(socket.data.uid, "loaded");

    socket.emit("loadedGameData", socket.data.uid);
}