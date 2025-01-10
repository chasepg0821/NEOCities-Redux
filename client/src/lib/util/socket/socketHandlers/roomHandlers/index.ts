import { UseNavigateResult } from "@tanstack/react-router";
import { ClientSocketType } from "../../SocketType"
import { AppDispatch } from "../../../store/store";
import { latencies } from "./latencies";
import { userJoined } from "./userJoined";
import { userLeft } from "./userLeft";
import { assignedRole } from "./assignedRole";

export const addRoomHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch: AppDispatch) => {
    socket.on("latencies", (l) => {
        latencies(dispatch, l);
    })
    socket.on("userJoined", (id, user) => {
        userJoined(dispatch, id, user);
    })
    socket.on("userLeft", (id) => {
        userLeft(dispatch, id);
    })
    socket.on("assignedRole", (role, user) => {
        assignedRole(dispatch, role, user);
    })
}

export const removeRoomHandlers = (socket: ClientSocketType) => {
    socket.off("latencies");
    socket.off("userJoined");
    socket.off("assignedRole");
}