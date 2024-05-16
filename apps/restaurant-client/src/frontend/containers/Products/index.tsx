import { useGetProductsQuery } from "@redux";
import { useDispatch } from "react-redux";

export const ProductsContainer = () => {
	const { data, error, isLoading } = useGetProductsQuery();
	useDispatch.withTypes<any>()

	return (
		<>dsa</>
	)
};