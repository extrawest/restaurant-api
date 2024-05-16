"use client";
import { FC } from "react";
import { Box } from "@mui/material";
import { DynamicPageProps, ProductPageParams } from "shared";

const Product: FC<DynamicPageProps<ProductPageParams>> = ({ params: { id }}) => {
	
	return (
		<Box py={6}>
			hello {id}
		</Box>
	);
};

export default Product;
