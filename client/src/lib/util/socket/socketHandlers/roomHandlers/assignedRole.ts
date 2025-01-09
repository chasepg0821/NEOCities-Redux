import { RoleID, UserID } from "../../../store/roomTypes";
import { ASSIGNED_ROLE } from "../../../store/slices/roomSlice";
import { AppDispatch } from "../../../store/store";

export const assignedRole = (dispatch: AppDispatch, role: RoleID, user: UserID) => {
    dispatch(ASSIGNED_ROLE({
        role,
        user
    }));
}