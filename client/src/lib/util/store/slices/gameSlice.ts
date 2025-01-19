import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EntityDestination, EntityID, GameDataType, GameScores, MessageType, ResourceID, TaskID, TaskType, UserID } from '../roomTypes';

const initialState: GameDataType = {
    players: {},
    scores: {
        team: 0
    },
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
        UPDATE_ENTITY_DEST: (state, action: PayloadAction<{id: EntityID, destination: EntityDestination}>) => {
            if (state.entities[action.payload.id]) state.entities[action.payload.id].destination = action.payload.destination;
        },
        NEW_TASKS: (state, action: PayloadAction<{[id: TaskID]: TaskType}>) => {
            state.tasks = {
                ...state.tasks,
                ...action.payload
            }
        },
        UPDATE_TASK_RESOURCES: (state, action: PayloadAction<{id: TaskID, resources: ResourceID[][]}>) => {
            if (state.tasks[action.payload.id]) state.tasks[action.payload.id].resources = action.payload.resources;
        },
        COMPLETED_TASK: (state, action: PayloadAction<TaskID>) => {
            delete state.tasks[action.payload];
        },
        SCORES: (state, action: PayloadAction<GameScores>) => {
            state.scores = action.payload;
        },
        NEW_MESSAGE: (state, action: PayloadAction<MessageType>) => {
            state.messages.push(action.payload);
        },
        SET_READY: (state, action: PayloadAction<{id: UserID, ready: boolean}>) => {
            state.players[action.payload.id].ready = action.payload.ready;
        }
    },
});

export const {
    STAGED_GAME,
    UPDATE_ENTITY_DEST,
    NEW_TASKS,
    UPDATE_TASK_RESOURCES,
    COMPLETED_TASK,
    SCORES,
    NEW_MESSAGE,
    SET_READY
} = gameSlice.actions;

const GameReducer = gameSlice.reducer;

export default GameReducer;