import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import type { RootState } from '../store';
import { generateUserName } from '../../usernameGenerator/usernameGenerator';

export interface AuthState {
	id: string; // uuidv4 string that uniquely identifies the session
	name: string; // randomly generated username
}

const initialState: AuthState = {
	id: uuidv4(),
	name: generateUserName(),
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
});

// Other code such as selectors can use the imported `RootState` type
export const selectAuthID = (state: RootState) => state.auth.id;

const AuthReducer = authSlice.reducer;

export default AuthReducer;