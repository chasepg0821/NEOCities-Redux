import { UseNavigateResult } from "@tanstack/react-router";
import { AppDispatch } from "../../../store/store";
import { ClientSocketType } from "../events";
import { loadedGameData } from "./loadedGameData";

export const addGenericGameHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch: AppDispatch) => {
    socket.on("loadedGameData", (id) => loadedGameData(dispatch, id));
}

export const removeGenericGameHandlers = (socket: ClientSocketType) => {
    socket.off("loadedGameData");
}