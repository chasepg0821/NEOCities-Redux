import { forEach } from "lodash";
import { getClients } from "../../../clients";
import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const stageGame = (socket: AppSocketType) => {
    const client = getClients().get(socket.data.uid);
    const room = client?.room ? getRooms().get(client.room) : undefined;

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    } else if (room.getAdmin().id !== socket.data.uid) {
        socket.emit("permError", "You are not the admin of the room.");
        return;
    }

    // TODO: uncomment when basic dev is done
    // let allRolesAssigned = true;
    // forEach(room.getRoleAssignments(), (user, _) => {if(user === "") allRolesAssigned = false});

    // if (!allRolesAssigned) {
    //     socket.emit("reqError", "Not all roles are assigned.");
    //     return;
    // }

    room.stageGame();
    socket.emit("stagedGame", socket.data.room);
    socket.broadcast.in(socket.data.room).emit("stagedGame", socket.data.room);
};
