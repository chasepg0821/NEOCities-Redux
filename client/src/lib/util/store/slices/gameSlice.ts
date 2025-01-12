import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameDataType, UserID } from '../roomTypes';

const initialState: GameDataType = {
    players: {},
    messages: [],
    roles: {},
    entities: {},
    tasks: {},
};

export const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
        STAGED_GAME: (state, action: PayloadAction<GameDataType>) => {
            state.players = action.payload.players;
            state.messages = action.payload.messages;
            state.roles = action.payload.roles;
            state.entities = action.payload.entities;
            state.tasks = action.payload.tasks;
        },
        LOADED_GAME_DATA_GAME: (state, action: PayloadAction<UserID>) => {
            if (state.players[action.payload]) state.players[action.payload].state = "loaded";
        }
    },
});

export const {
    STAGED_GAME,
    LOADED_GAME_DATA_GAME
} = gameSlice.actions;

const GameReducer = gameSlice.reducer;

export default GameReducer;