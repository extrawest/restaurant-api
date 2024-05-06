"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from '@reduxjs/toolkit/query'

export const productsApi = createApi({
	reducerPath: "productsApi",
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
	endpoints: (builder) => ({
		getProducts: builder.query<any, void>({
			query: () => `product`
		})
	})
});

export const { useGetProductsQuery } = productsApi;