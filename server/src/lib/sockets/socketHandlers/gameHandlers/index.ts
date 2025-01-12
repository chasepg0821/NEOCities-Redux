import { AppSocketType } from "../../socketTypes";
import { loadedGameData } from "./loadedGameData";

export const addGameHandlers = (socket: AppSocketType) => {
    socket.on("loadedGameData", () => loadedGameData(socket));
}
