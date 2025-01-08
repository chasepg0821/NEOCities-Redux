import { useNavigate, UseNavigateResult } from "@tanstack/react-router"
import { RoomLobbyData } from "../../../store/roomTypes"
import { JOINED_ROOM } from "../../../store/slices/roomSlice"

export const joinResponse = (dispatch, nav: UseNavigateResult<string>, success: boolean, info: string | RoomLobbyData) => {
    if (success && typeof info === 'object') {
        dispatch(JOINED_ROOM(info))
        nav({ to: `/room/${info.id}/` })
    } else {
        alert(info)
    }
}