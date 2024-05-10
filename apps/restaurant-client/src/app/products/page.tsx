"use client";
import { useGetProductsQuery } from "@redux";

/* eslint-disable-next-line */
export interface ProductsProps {}

export default function Products(props: ProductsProps) {
	const { data, error, isLoading } = useGetProductsQuery();
	
	return (
		<div>
			
			<h1>Welcome to Products!</h1>
		</div>
	);
}
