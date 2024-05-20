"use client";
import { useIntl } from "react-intl";
import { redirect } from "next/navigation";
import { useCallback, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { Pages } from "shared";
import { useHandleError } from "../../hooks";
import { useRegistrationMutation } from "@redux";
import { RegistrationForm, RegistrationFormType } from "../../forms";

export const RegistrationPageContainer = () => {
	const [register, { isSuccess, isError }] = useRegistrationMutation();
	const { $t } = useIntl();

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
		text: $t({ id: "registration.fail" })
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