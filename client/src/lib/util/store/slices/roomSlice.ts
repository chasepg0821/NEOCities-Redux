import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RoleID, LobbyDataType, UserID, UserType } from "../roomTypes";
import { forEach } from "lodash";

const initialState: LobbyDataType = {
    id: "",
    admin: {
        id: "",
        name: ""
    },
    users: {},
    roles: {},
    roleAssignments: {}
};

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        JOINED_ROOM: (state, action: PayloadAction<LobbyDataType>) => {
            state.id = action.payload.id;
            state.admin = action.payload.admin;
            state.users = action.payload.users;
            state.roles = action.payload.roles;
            state.roleAssignments = action.payload.roleAssignments;
        },
        LEFT_ROOM: (state) => {
            state.id = "";
            state.admin = {
                id: "",
                name: ""
            };
            state.users = {};
            state.roles = {};
            state.roleAssignments = {};
        },
        LATENCIES: (
            state,
            action: PayloadAction<{ [id: UserID]: { latency: number } }>
        ) => {
            forEach(action.payload, (data, uid) => {
                if (state.users[uid]) state.users[uid].latency = data.latency;
            });
        },
        USER_JOINED: (
            state,
            action: PayloadAction<{ id: UserID; user: UserType }>
        ) => {
            state.users[action.payload.id] = action.payload.user;
        },
        USER_LEFT: (state, action: PayloadAction<UserID>) => {
            delete state.users[action.payload];
        },
        ASSIGNED_ROLE: (
            state,
            action: PayloadAction<{ role: RoleID; user: UserID }>
        ) => {
            forEach(state.roleAssignments, (u, r) => {
                if (parseInt(r) === action.payload.role) {
                    state.roleAssignments[parseInt(r)] = action.payload.user;
                } else if (u === action.payload.user) {
                    state.roleAssignments[parseInt(r)] = "";
                }
            });
        },
        LOADED_GAME_DATA: (state, action: PayloadAction<UserID>) => {
            if (state.users[action.payload]) state.users[action.payload].loaded = true;
        }
    }
});

export const { JOINED_ROOM, LEFT_ROOM, LATENCIES, USER_JOINED, USER_LEFT, ASSIGNED_ROLE, LOADED_GAME_DATA } =
    roomSlice.actions;

const RoomReducer = roomSlice.reducer;

export default RoomReducer;
