import { UseNavigateResult } from "@tanstack/react-router";
import { ClientSocketType } from "../../SocketType"
import { joinResponse } from "./joinResponse"

export const addRoomHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch) => {
    socket.on("joinResponse", (success, info) => {
        joinResponse(dispatch, nav, success, info);
    })
}

export const removeRoomHandlers = (socket: ClientSocketType) => {
    socket.off("joinResponse");
}