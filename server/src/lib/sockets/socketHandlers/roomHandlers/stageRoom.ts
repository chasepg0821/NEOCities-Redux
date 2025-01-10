import { getClients } from "../../../clients";
import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const stageGame = (socket: AppSocketType) => {
    const client = getClients().get(socket.data.uid);
    const room = client?.room ? getRooms().get(client.room) : undefined;

    // room exists and the request is from the admin
    if (room && room.getAdmin().id === socket.data.uid) {
        room.stageGame();
        socket.emit("stagedGame", socket.data.room);
        socket.broadcast.in(socket.data.room).emit("stagedGame", socket.data.room);
    // room exists, but request is not from the admin
    } else if (room) {
        socket.emit("permError", "You are not the admin of the room.");
    // room doesn't exist
    } else {
        socket.emit("reqError", "Room could not be found.");
    }
}