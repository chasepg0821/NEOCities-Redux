import { UseNavigateResult } from "@tanstack/react-router";
import { ClientSocketType } from "../../SocketType"
import { joinResponse } from "./joinResponse"

export const addRoomHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>) => {
    socket.on("joinResponse", (success, room, reason?: string) => {
        joinResponse(nav, success, room, reason);
    })
}

export const removeRoomHandlers = (socket: ClientSocketType) => {
    socket.off("joinResponse");
}