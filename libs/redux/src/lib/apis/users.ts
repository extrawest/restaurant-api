import { createApi } from "@reduxjs/toolkit/query/react";
import { User } from "shared";
import { authBaseQuery } from "../utils";

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: authBaseQuery("users"),
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
		logOut: builder.mutation<User, void>({
			query: () => ({
				url: "/logout",
				method: "POST",
			}),
		}),
	})
});

export const { registration, logOut, getCurrentUser } = usersApi.endpoints;
export const { useRegistrationMutation, useLogOutMutation } = usersApi;