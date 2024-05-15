import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AuthResponse } from "shared";
import { RootState } from '../store';
import { logOut, login } from '../apis';

const initialState: AuthResponse & { isLoggedIn: boolean } = {
	access_token: "",
	isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
		updateAccessToken(state, action: PayloadAction<string>) {
			state.access_token = action.payload;
			state.isLoggedIn = true;
		},
		updateIsLoggedIn(state, action: PayloadAction<boolean>) {
			state.isLoggedIn = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			login.matchFulfilled,
			(state, { payload }) => {
				state.isLoggedIn = true;
				state.access_token = payload;
			},
		),
		builder.addMatcher(
			logOut.matchFulfilled,
			(state) => {
				state.access_token = "";
				state.isLoggedIn = false;
			}
		)
	},
});

export const selectAuth = (state: RootState) => state.auth.value;

export default authSlice.reducer;