import { UseNavigateResult } from "@tanstack/react-router"
import { ClientSocketType } from "../../SocketType"
import { ping } from "./ping"

export * from "./ping"

export const addUtilHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>) => {
    socket.on("ping", (timestamp: number) => {
        ping(socket, timestamp);
    })
}

export const removeUtilHandlers = (socket: ClientSocketType) => {
    socket.off("ping");
}