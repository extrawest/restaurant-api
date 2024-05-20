"use client";
import { FC } from "react";
import { useGetProductsByCategoryQuery } from "@redux";
import { ProductsByCategoriesContainesProps } from "shared";
import { ProductsByCategoriesCarousel } from "../../components";

export const ProductsByCategoriesContainer: FC<ProductsByCategoriesContainesProps> = ({ categoryId }) => {
	const { data } = useGetProductsByCategoryQuery(categoryId);

	return (
		<ProductsByCategoriesCarousel products={data || []} />
	);
};
