"use client";
import { ProductsContainer } from "../../frontend/containers";
import { Box } from "@mui/material";

/* eslint-disable-next-line */
export interface ProductsProps {}

export default function Products(props: ProductsProps) {	
	return (
		<Box py={6}>
			<ProductsContainer />
		</Box>
	);
}
