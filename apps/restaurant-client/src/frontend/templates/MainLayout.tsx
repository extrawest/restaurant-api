import { FC, PropsWithChildren } from "react";
import { Box, Container } from "@mui/material";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
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