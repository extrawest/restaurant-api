"use client";
import { Box } from "@mui/material";
import { ProductsPageContainer } from "../../frontend/containers";

/* eslint-disable-next-line */
export interface ProductsProps {}

export default function Products(props: ProductsProps) {	
	return (
		<Box py={6}>
			<ProductsPageContainer />
		</Box>
	);
}
