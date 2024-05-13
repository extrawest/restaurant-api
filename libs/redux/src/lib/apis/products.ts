"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { authBaseQuery } from "../utils";

export const productsApi = createApi({
	reducerPath: "productsApi",
	baseQuery: authBaseQuery("products"),
	endpoints: (builder) => ({
		getProducts: builder.query<any, void>({
			query: () => `product`
		})
	}),
});

export const { useGetProductsQuery } = productsApi;