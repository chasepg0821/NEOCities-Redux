import { getClients } from "../../../clients";
import { EntityID, getRooms, TaskID } from "../../../rooms";
import { AppSocketType } from "../../socketTypes";

export const sendResource = (socket: AppSocketType, entity: EntityID, task: TaskID) => {
    const client = getClients().getClient(socket.data.uid);
    const room = client?.room ? getRooms().getRoom(client.room) : undefined;

    const [role, _] = entity.split("_");

    if (!room) {
        socket.emit("reqError", "Room could not be found.");
        return;
    } else if (room.getRoleAssignments()[parseInt(role)] !==  socket.data.uid) {
        socket.emit("permError", "You do not control this resource.");
        return;
    }

    room.getGame()?.sendResource(entity, task);
};