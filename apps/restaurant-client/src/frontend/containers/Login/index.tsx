"use client";
import { useLoginMutation } from "@redux";
import { LoginComponent } from "../../components";

export const LoginContainer = () => {
	const [login, loginResult] = useLoginMutation();
	const onSubmit = (email: string, password: string) => {
		login({
			email,
			password
		});
	};
	console.log("loginResult", loginResult)
	return (
		<LoginComponent onSubmit={onSubmit} />
	)
};