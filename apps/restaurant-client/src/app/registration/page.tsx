import { Box } from "@mui/material";
import { RegistrationContainer } from "../../frontend/containers";

/* eslint-disable-next-line */
export interface RegistrationProps {}

export default function Registration(props: RegistrationProps) {
	return (
		<Box py={6}>
			<RegistrationContainer />
		</Box>
	);
}
