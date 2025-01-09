import { UseNavigateResult } from "@tanstack/react-router"
import { ClientSocketType } from "../../SocketType"
import { ping } from "./ping"
import { AppDispatch } from "../../../store/store"

export const addUtilHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch: AppDispatch) => {
    socket.on("ping", (timestamp: number) => {
        ping(socket, timestamp);
    })
}

export const removeUtilHandlers = (socket: ClientSocketType) => {
    socket.off("ping");
}