import { Box } from "@mui/material";
import { RegistrationPageContainer } from "../../frontend/containers";

/* eslint-disable-next-line */
export interface RegistrationProps {}

export default function Registration(props: RegistrationProps) {
	return (
		<Box py={6}>
			<RegistrationPageContainer />
		</Box>
	);
}
