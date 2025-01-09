import { UserID, UserType } from "../../../store/roomTypes";
import { USER_JOINED } from "../../../store/slices/roomSlice";
import { AppDispatch } from "../../../store/store";

export const userJoined = (dispatch: AppDispatch, id: UserID, user: UserType) => {
    dispatch(USER_JOINED({
        id,
        user
    }))
}