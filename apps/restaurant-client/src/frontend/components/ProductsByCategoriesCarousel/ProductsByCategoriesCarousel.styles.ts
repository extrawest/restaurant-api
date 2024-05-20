import { Box, styled } from "@mui/material";

export const CarouselItemImageContainer = styled(Box)(() => ({
	height: 300
}));

export const CarouselItemImage = styled("img")(() => ({
	maxHeight: "100%",
	maxWidth: "100%",
}));