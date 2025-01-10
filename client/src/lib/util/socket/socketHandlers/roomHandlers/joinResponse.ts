import { UseNavigateResult } from "@tanstack/react-router"
import { LobbyDataType } from "../../../store/roomTypes"
import { JOINED_ROOM } from "../../../store/slices/roomSlice"
import { AppDispatch } from "../../../store/store";

export const joinResponse = (dispatch: AppDispatch, nav: UseNavigateResult<string>, success: boolean, info: string | LobbyDataType) => {
    if (success && typeof info === 'object') {
        dispatch(JOINED_ROOM(info))
        nav({ to: `/room/${info.id}/` })
    } else {
        alert(info)
    }
}