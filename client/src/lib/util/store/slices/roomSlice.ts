import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RoleID, RoomLobbyData, UserID, UserType } from '../roomTypes';
import { forEach } from 'lodash';

const initialState: RoomLobbyData = {
	id: "",
    admin: "",
	users: {},
    roles: {},
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
            state.roles = action.payload.roles;
            state.roleAssignments = action.payload.roleAssignments;
        },
        LATENCIES: (state, action: PayloadAction<{[id: UserID]: { latency: number }}>) => {
            forEach(action.payload, (data, uid) => {
                if (state.users[uid]) state.users[uid].latency = data.latency;
            });
        },
        USER_JOINED: (state, action: PayloadAction<{ id: UserID, user: UserType }>) => {
            state.users[action.payload.id] = action.payload.user;
        },
        USER_LEFT: (state, action: PayloadAction<UserID>) => {
            delete state.users[action.payload];
        },
        ASSIGNED_ROLE: (state, action: PayloadAction<{ role: RoleID, user: UserID }>) => {
            state.roleAssignments[action.payload.role] = action.payload.user;
        }
    },
});

export const {
    JOINED_ROOM,
    LATENCIES,
    USER_JOINED,
    USER_LEFT,
    ASSIGNED_ROLE
} = roomSlice.actions;

const RoomReducer = roomSlice.reducer;

export default RoomReducer;