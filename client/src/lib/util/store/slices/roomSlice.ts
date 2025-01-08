import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RoomLobbyData } from '../roomTypes';

const initialState: RoomLobbyData = {
	id: "",
    admin: "",
	users: {},
    roleAssignments: {}
};

export const roomSlice = createSlice({
	name: "room",
	initialState,
	reducers: {
        JOINED_ROOM: (state, action: PayloadAction<RoomLobbyData>) => {
            state.id = action.payload.id;
            state.admin = action.payload.admin;
            state.users = action.payload.users;
            state.roleAssignments = action.payload.roleAssignments;
        }
    },
});

export const {
    JOINED_ROOM
} = roomSlice.actions;

const RoomReducer = roomSlice.reducer;

export default RoomReducer;