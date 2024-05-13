"use client";
import { useCallback } from "react";
import { useLoginMutation } from "@redux";
import { SubmitHandler } from "react-hook-form";
import { LoginForm, LoginFormType } from "../../forms";

export const LoginContainer = () => {
	const [login] = useLoginMutation();
	
	const onSubmit: SubmitHandler<LoginFormType> = useCallback(
		(data) => {
			login({
				email: data.email,
				password: data.password
			});
	}, []);

	return (
		<LoginForm
			onSubmit={onSubmit}
		/>
	)
};