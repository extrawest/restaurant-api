import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../utils";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: customBaseQuery("auth"),
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (body) => ({
				url: "/login",
				method: "POST",
				body,
			}),
		})
	})
});

export const { login } = authApi.endpoints;
export const { useLoginMutation } = authApi;