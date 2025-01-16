import { UserID } from "@/lib/util/store/roomTypes";
import { TOGGLE_READY } from "@/lib/util/store/slices/gameSlice";
import { AppDispatch } from "@/lib/util/store/store";

export const toggleReady = (dispatch: AppDispatch, id: UserID) => {
    dispatch(TOGGLE_READY(id));
}