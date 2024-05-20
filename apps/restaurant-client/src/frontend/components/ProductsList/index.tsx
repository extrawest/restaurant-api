import Link from "next/link";
import { Box, Grid, Typography, Link as MuiLink } from "@mui/material";
import { ProductsListProps } from "shared";
import { ProductImageContainer } from "./ProductsList.styles";

export const ProductsList = ({ products }: ProductsListProps) => {
	return (
		<Grid container spacing={2}>
			{products.map((product) => {
				return (
					<Grid item md={6} xs={12}>
						<Box>
							<ProductImageContainer>
								<img src={product.image} />
							</ProductImageContainer>
							<Link href={`products/${product.id}`}>
								<MuiLink variant="h4">{product.name}</MuiLink>
							</Link>
							<Typography>
								{
									new Intl.NumberFormat("en-US", {
										style: "currency",
										currency: product.currency,
									}).format(product.discountedPrice ? product.discountedPrice : product.price)
								}
							</Typography>
						</Box>
					</Grid>
				)
			})}
		</Grid>
	)
}