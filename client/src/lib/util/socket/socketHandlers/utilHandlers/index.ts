import { UseNavigateResult } from "@tanstack/react-router"
import { ping } from "./ping"
import { AppDispatch } from "../../../store/store"
import { permError } from "./permError"
import { reqError } from "./reqError"
import { ClientSocketType } from "../events"

export const addUtilHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch: AppDispatch) => {
    socket.on("ping", (timestamp: number) => {
        ping(socket, timestamp);
    });
    socket.on("permError", (err) => {
        permError(err);
    });
    socket.on("reqError", (err) => {
        reqError(err);
    });
}

export const removeUtilHandlers = (socket?: ClientSocketType) => {
    socket?.off("ping");
    socket?.off("permError");
    socket?.off("reqError");
}