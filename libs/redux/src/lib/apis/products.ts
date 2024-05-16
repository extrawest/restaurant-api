import { createApi } from "@reduxjs/toolkit/query/react";
import { authBaseQuery } from "../utils";
import { Product } from "shared";

export const productsApi = createApi({
	reducerPath: "productsApi",
	baseQuery: authBaseQuery("product"),
	endpoints: (builder) => ({
		getProducts: builder.query<Product[], void>({
			query: () => ""
		}),
		getProduct: builder.query<Product, void>({
			query: (id) => ""
		})
	}),
});

export const { getProducts } = productsApi.endpoints;
export const { useGetProductsQuery } = productsApi;