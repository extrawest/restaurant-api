import { createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../apis";
import { ProductsState } from "shared";

const initialState: ProductsState = {
	entities: []
};

export const productsSlice = createSlice({
	name: "productsSlice",
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder.addMatcher(
			getProducts.matchFulfilled,
			(state, { payload }) => {
				state.entities = payload;
			}
		)
	}
});

export const productsSliceReducer = productsSlice.reducer;