"use client";
import { useCallback } from "react";
import { useLoginMutation } from "@redux";
import { SubmitHandler } from "react-hook-form";
import { LoginForm } from "../../forms";
import { LoginFormType } from "../../forms/LoginForm/LoginForm.schema";

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