import { Box, Typography } from "@mui/material"
import { HeroSectionContainer } from "./HeroSection.styles"

export const HeroSection = () => {
	return (
		<HeroSectionContainer>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				height="100%"
				px={4}
			>
				<Typography variant="h6" color="white" textTransform="uppercase">Welcome to the restaurant</Typography>
				<Typography variant="h4" color="white" textTransform="uppercase" mt={3}>TRY A BETTER & <br/>FASTER EATING EXPERIENCE</Typography>
			</Box>
		</HeroSectionContainer>
	)
}