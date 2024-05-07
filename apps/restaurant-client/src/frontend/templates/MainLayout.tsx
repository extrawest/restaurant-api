import { Box, Container } from "@mui/material";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Header />
			<Container>
				<Box pt={6}>
					{children}
				</Box>
			</Container>
			<Footer />
		</>
	);
};

export default MainLayout;