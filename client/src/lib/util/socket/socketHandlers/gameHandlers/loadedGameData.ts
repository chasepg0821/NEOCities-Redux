import { UserID } from "../../../store/roomTypes";
import { LOADED_GAME_DATA } from "../../../store/slices/roomSlice";
import { AppDispatch } from "../../../store/store";

export const loadedGameData = (dispatch: AppDispatch, id: UserID) => {
    dispatch(LOADED_GAME_DATA(id));
}