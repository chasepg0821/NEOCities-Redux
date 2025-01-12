import { UserID } from "../../../store/roomTypes";
import { LOADED_GAME_DATA_GAME } from "../../../store/slices/gameSlice";
import { LOADED_GAME_DATA_ROOM } from "../../../store/slices/roomSlice";
import { AppDispatch } from "../../../store/store";

export const loadedGameData = (dispatch: AppDispatch, id: UserID) => {
    dispatch(LOADED_GAME_DATA_GAME(id));
    dispatch(LOADED_GAME_DATA_ROOM(id));
}