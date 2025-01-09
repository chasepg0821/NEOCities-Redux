import { UseNavigateResult } from "@tanstack/react-router";
import { ClientSocketType } from "../../SocketType"
import { joinResponse } from "./joinResponse"
import { AppDispatch } from "../../../store/store";
import { latencies } from "./latencies";
import { userJoined } from "./userJoined";
import { userLeft } from "./userLeft";

export const addRoomHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch: AppDispatch) => {
    socket.on("joinResponse", (success, info) => {
        joinResponse(dispatch, nav, success, info);
    })
    socket.on("latencies", (l) => {
        latencies(dispatch, l);
    })
    socket.on("userJoined", (id, user) => {
        userJoined(dispatch, id, user);
    })
    socket.on("userLeft", (id) => {
        userLeft(dispatch, id);
    })
}

export const removeRoomHandlers = (socket: ClientSocketType) => {
    socket.off("joinResponse");
    socket.off("latencies");
    socket.off("userJoined");
}