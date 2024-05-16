import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthResponse, Token } from "shared";
import { logOut, login } from '../apis';

const initialState: AuthResponse & { isLoggedIn: boolean } = {
	token: undefined,
	isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
		updateAccessToken(state, action: PayloadAction<Token>) {
			state.token = action.payload;
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
				state.token = payload;
			},
		),
		builder.addMatcher(
			logOut.matchFulfilled,
			(state) => {
				state.token = undefined;
				state.isLoggedIn = false;
			}
		)
	},
});

export const authSliceReducer = authSlice.reducer;
