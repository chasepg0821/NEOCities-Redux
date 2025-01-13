import { AppSocketType } from "../../socketTypes";
import { loadedGameData } from "./loadedGameData";
import { sendMessage } from "./sendMessage";
import { sendResource } from "./sendResource";

export const addGameHandlers = (socket: AppSocketType) => {
    socket.on("loadedGameData", () => loadedGameData(socket));
    socket.on("sendResource", (entity, task) => sendResource(socket, entity, task));
    socket.on("sendMessage", (text) => sendMessage(socket, text));
}
