import { UseNavigateResult } from "@tanstack/react-router";
import { ClientSocketType } from "../../SocketType"
import { joinResponse } from "./joinResponse"
import { AppDispatch } from "../../../store/store";

export const addRoomHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch: AppDispatch) => {
    socket.on("joinResponse", (success, info) => {
        joinResponse(dispatch, nav, success, info);
    })
}

export const removeRoomHandlers = (socket: ClientSocketType) => {
    socket.off("joinResponse");
}