import { Box } from "@mui/material";
import { useGetProductsQuery } from "@redux";
import { ProductsList } from "../../components";

export const ProductsPageContainer = () => {
	const { data } = useGetProductsQuery();

	return (
		<Box>
			<ProductsList products={data || []} />
		</Box>
	)
};