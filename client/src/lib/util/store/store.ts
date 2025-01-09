import { combineReducers, configureStore } from '@reduxjs/toolkit';
import sessionStorage from 'redux-persist/lib/storage/session';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
  } from 'redux-persist';

import AuthReducer from './slices/authSlice';
import RoomReducer from './slices/roomSlice';
import GameReducer from './slices/gameSlice';

const persistConfig = {
	key: 'root',
	storage: sessionStorage,
    whitelist: ['auth']
};

const rootReducer = combineReducers({
    auth: AuthReducer,
	room: RoomReducer,
	game: GameReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
		reducer: persistedReducer,
		devTools: process.env.NODE_ENV !== 'production',
		middleware: (getDefaultMiddleware) => getDefaultMiddleware({
			serializableCheck: {
			  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		  }),
	});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;