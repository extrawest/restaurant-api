import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "shared";
import { customBaseQuery } from "../utils";

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: customBaseQuery("users"),
	endpoints: (builder) => ({
		//TODO: get current user endpoint on the BE
		getCurrentUser: builder.query<User, null>({
			query: () => ({
				url: "/current_user",
				method: "GET",
			})
		}),
		registration: builder.mutation({
			query: (body) => ({
				url: "/create",
				method: "POST",
				body,
			}),
		}),
		//TODO: log out user endpoint on the BE
		logOut: builder.query<User, void>({
			query: () => ({
				url: "/user/me/log_out",
				method: "GET",
			}),
		}),
	})
});

export const { registration, logOut, getCurrentUser } = usersApi.endpoints;
export const { useRegistrationMutation } = usersApi;