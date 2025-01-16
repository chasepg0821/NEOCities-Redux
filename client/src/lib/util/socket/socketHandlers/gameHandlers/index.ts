import { UserID } from "../../../store/roomTypes";
import { AppDispatch } from "../../../store/store";
import { ClientSocketType } from "../events";
import { loadedGameData } from "./loadedGameData";
import { toggleReady } from "./toggleReady";

export const addGenericGameHandlers = (socket: ClientSocketType, dispatch: AppDispatch) => {
    socket.on("loadedGameData", (id) => loadedGameData(dispatch, id));
    socket.on("toggleReady", (id) => toggleReady(dispatch, id));
}

export const removeGenericGameHandlers = (socket: ClientSocketType) => {
    socket.off("loadedGameData");
    socket.off("toggleReady");
}