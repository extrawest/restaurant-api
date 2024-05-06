"use client";
import { useGetProductsQuery } from "@redux";

/* eslint-disable-next-line */
export interface ProductsProps {}

export default function Products(props: ProductsProps) {
	const { data, error, isLoading } = useGetProductsQuery();
	
	console.log(data);
	return (
		<div>
			
			<h1>Welcome to Products!</h1>
		</div>
	);
}
