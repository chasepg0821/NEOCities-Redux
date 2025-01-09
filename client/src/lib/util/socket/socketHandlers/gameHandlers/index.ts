import { UseNavigateResult } from "@tanstack/react-router"
import { ClientSocketType } from "../../SocketType"
import { AppDispatch } from "../../../store/store"

export const addGameHandlers = (socket: ClientSocketType, nav: UseNavigateResult<string>, dispatch: AppDispatch) => {
    console.log("Added game handlers.")
}

export const removeGameHandlers = (socket: ClientSocketType) => {
    console.log("Removed game handlers.")
}