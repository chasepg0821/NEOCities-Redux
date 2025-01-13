import { forEach } from "lodash";
import { getClients } from "../../../clients";
import { getRooms } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const stageGame = (socket: AppSocketType) => {
    const client = getClients().getClient(socket.data.uid);
    const room = client?.room ? getRooms().getRoom(client.room) : undefined;

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    } else if (room.getAdmin().id !== socket.data.uid) {
        socket.emit("permError", "You are not the admin of the room.");
        return;
    }

    let allRolesAssigned = true;
    forEach(room.getRoleAssignments(), (user, _) => {if(user === "") allRolesAssigned = false});

    if (!allRolesAssigned) {
        socket.emit("reqError", "Not all roles are assigned.");
        return;
    }

    room.stageGame();
};
