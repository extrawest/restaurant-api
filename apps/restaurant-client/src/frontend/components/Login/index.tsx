"use client";
import {
	Box,
	Button,
	TextField
} from "@mui/material";
import { useState } from "react";
import { LoginProps } from "shared";

export const LoginComponent = ({ onSubmit }: LoginProps) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			flexDirection="column"
			py={5}
		>
			<TextField
				label="username"
				onChange={(e) => setUsername(e.currentTarget.value)}
			/>
			<Box mt={2} />
			<TextField
				label="password"
				onChange={(e) => setPassword(e.currentTarget.value)}
			/>
			<Box mt={2} />
			<Button
				variant="outlined"
				onClick={() => onSubmit(username, password)}
				disabled={!username || !password}
			>
				Login
			</Button>
		</Box>
	);
};