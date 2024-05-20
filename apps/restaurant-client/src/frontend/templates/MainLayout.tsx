import { FC, PropsWithChildren } from "react";
import { Box } from "@mui/material";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<Header />
			<Box>
				{children}
			</Box>
			<Footer />
		</>
	);
};

export default MainLayout;