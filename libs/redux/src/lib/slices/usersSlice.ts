import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { Role, User } from "shared";
import { getCurrentUser, logOut, login, registration } from '../apis';

const initialState: User = {
	id: 0,
	name: "",
	email: "",
	role: Role.Buyer,
	stripeCustomerId: "",
	currentHashedRefreshToken: ""
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			login.matchFulfilled,
			(state, { payload }) => {
				const encodedPayload = jwtDecode<User>(payload.access_token);
				state.id = encodedPayload?.id,
				state.name = encodedPayload?.name,
				state.email = encodedPayload?.email,
				state.role = encodedPayload?.role,
				state.stripeCustomerId = encodedPayload?.stripeCustomerId,
				state.currentHashedRefreshToken = encodedPayload?.currentHashedRefreshToken
			}
		)
		// builder.addMatcher(
		// 	registration.matchFulfilled,
		// 	(state, { payload }) => {
		// 		state.id = payload.id,
		// 		state.name = payload.name,
		// 		state.email = payload.email,
		// 		state.role = payload.role,
		// 		state.stripeCustomerId = payload.stripeCustomerId,
		// 		state.currentHashedRefreshToken = payload.currentHashedRefreshToken
		// 	}
		// ),
		builder.addMatcher(
			logOut.matchFulfilled,
			(state) => {
				state.id = 0,
				state.name = "",
				state.email = "",
				state.role = Role.Buyer,
				state.stripeCustomerId = "",
				state.currentHashedRefreshToken = ""
			}
		),
		builder.addMatcher(
			getCurrentUser.matchFulfilled,
			(
				state, { payload }
			) => {
				state.id = payload.id,
				state.name = payload.name,
				state.email = payload.email,
				state.role = payload.role,
				state.stripeCustomerId = payload.stripeCustomerId,
				state.currentHashedRefreshToken = payload.currentHashedRefreshToken
			}
		);

	},
})

export const usersSliceReducer = usersSlice.reducer;