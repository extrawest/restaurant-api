import { Box } from "@mui/material";
import { LoginContainer } from "../../frontend/containers";

/* eslint-disable-next-line */
export interface LoginProps {}

export default function Login(props: LoginProps) {
	return (
		<Box py={6}>
			<LoginContainer />
		</Box>
	);
}
