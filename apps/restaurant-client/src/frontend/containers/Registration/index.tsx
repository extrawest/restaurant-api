"use client";
import { redirect } from "next/navigation";
import { useCallback, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { useRegistrationMutation } from "@redux";
import { Pages } from "shared";
import { useHandleError } from "../../hooks";
import { RegistrationForm, RegistrationFormType } from "../../forms";
// import { useIntl } from "react-intl";

export const RegistrationContainer = () => {
	const [register, { isSuccess, isError }] = useRegistrationMutation();
	// const res = useIntl();
	// console.log(res.messages["dsa"])
	const onSubmit: SubmitHandler<RegistrationFormType> = useCallback(
		(data) => {
			register({
				email: data.email,
				password: data.password,
				name: data.name,
			});
	}, []);

	useHandleError({
		trigger: isError,
		text: "Registration failed"
	});

	useEffect(() => {
		if (isSuccess) {
			redirect(Pages.LOGIN);
		};
	}, [isSuccess]);

	return (
		<RegistrationForm
			onSubmit={onSubmit}
		/>
	)
};