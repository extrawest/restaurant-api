import { useGetProductsQuery } from "@redux";

export const ProductPageContainer = () => {
	const { data, error, isLoading } = useGetProductsQuery();

	return (
		<>dsa</>
	)
};