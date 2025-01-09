import { UserID, UserType } from "../../../store/roomTypes";
import { USER_LEFT } from "../../../store/slices/roomSlice";
import { AppDispatch } from "../../../store/store";

export const userLeft = (dispatch: AppDispatch, id: UserID) => {
    dispatch(USER_LEFT(id))
}