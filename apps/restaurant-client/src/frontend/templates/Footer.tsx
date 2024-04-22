import { Adb } from "@mui/icons-material";
import { blue } from '@mui/material/colors';
import { Box, Container, Typography } from "@mui/material";

export const Footer = () => {
	return (
		<Container
			maxWidth="xl"
			style={{
				backgroundColor: blue[700],
				color: "white",
				textAlign: "center"
			}}
		>
			<Box py={2}>
				<Box display="flex" alignItems="center" justifyContent="center">
					<Adb />
					<Typography
						variant="h6"
						noWrap
						component="a"
						sx={{
							mr: 2,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						LOGO
					</Typography>
				</Box>
				<Typography>
					© {new Date().getFullYear()} Name. All rights reserved.
				</Typography>
			</Box>
		</Container>
	);
};