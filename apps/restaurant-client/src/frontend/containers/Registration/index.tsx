"use client";
import { useCallback } from "react";
import { useLoginMutation } from "@redux";
import { SubmitHandler } from "react-hook-form";
import { RegistrationForm, RegistrationFormType } from "../../forms";

export const RegistrationContainer = () => {
	const [register] = useRegistrationMutation();
	
	const onSubmit: SubmitHandler<RegistrationFormType> = useCallback(
		(data) => {
			register({
				email: data.email,
				password: data.password
			});
	}, []);

	return (
		<RegistrationForm
			onSubmit={onSubmit}
		/>
	)
};