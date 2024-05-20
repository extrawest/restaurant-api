import { Box, Typography } from "@mui/material";
import { HeroSection } from "../../components";
import { ProductsByCategoriesContainer } from "../ProductsByCategories";

export const MainPageContainer = () => {
	return (
		<Box>
			<HeroSection />
			<Box py={4}>
				<Typography p={4} variant="h3">Best SEAFOOD</Typography>
				<ProductsByCategoriesContainer categoryId={1} />
			</Box>
		</Box>
	);
};