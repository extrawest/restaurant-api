import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "../store";

const serverURL = `http://${process.env.NEXT_PUBLIC_NX_SERVER_HOST}:${process.env.NEXT_PUBLIC_NX_SERVER_PORT}`;

export const authBaseQuery = (apiServiceName: string = "") => {
	const apiServicePath = apiServiceName.startsWith("/") ? apiServiceName.substring(1) : apiServiceName;
	const baseUrl = `${serverURL}/${apiServicePath}`;
	return fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token?.access_token;

			if (token) {
				headers.set("authorization", `Bearer ${token}`);
			};

			return headers;
		},
	});
};

export const customBaseQuery = (apiServiceName: string = "") => {
	const apiServicePath = apiServiceName.startsWith("/") ? apiServiceName.substring(1) : apiServiceName;
	const baseUrl = `${serverURL}/${apiServicePath}`;
	return fetchBaseQuery({
		baseUrl
	});
};