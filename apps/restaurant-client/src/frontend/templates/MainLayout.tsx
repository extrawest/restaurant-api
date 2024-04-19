import { Box, Container } from "@mui/material";
import { Header } from "./Header";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header />
			<Container>
				<Box pt={6}>
					{children}
				</Box>
			</Container>
		</>
	);
};

export default MainLayout;