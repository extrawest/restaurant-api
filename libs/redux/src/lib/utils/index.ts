import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../store";

export const authBaseQuery = (baseUrl: string = "") => {
	return fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.access_token;

			if (token) {
				headers.set("authorization", `Bearer ${token}`);
			};

			return headers;
		},
	});
};

export const customBaseQuery = (baseUrl: string = "") => {
	return fetchBaseQuery({
		baseUrl
	});
};