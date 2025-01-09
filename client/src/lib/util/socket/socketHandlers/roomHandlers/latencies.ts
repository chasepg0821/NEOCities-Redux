import { UserID } from "../../../store/roomTypes";
import { LATENCIES } from "../../../store/slices/roomSlice";
import { AppDispatch } from "../../../store/store";

export const latencies = (dispatch: AppDispatch, latencies: {[id: UserID]: {latency: number}}) => {
    dispatch(LATENCIES(latencies));
}