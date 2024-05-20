"use client";
import { useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import { useLoginMutation } from "@redux";
import { redirect } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { useHandleError } from "../../hooks";
import { LoginForm, LoginFormType } from "../../forms";
import { Pages } from "shared";

export const LoginPageContainer = () => {
	const [login, { isError, isSuccess }] = useLoginMutation();
	const { $t } = useIntl();

	const onSubmit: SubmitHandler<LoginFormType> = useCallback(
		(data) => {
			login({
				email: data.email,
				password: data.password
			});
	}, []);

	useHandleError({
		trigger: isError,
		text: $t({ id: "login.fail" })
	});

	useEffect(() => {
		if (isSuccess) {
			redirect(Pages.HOME);
		};
	}, [isSuccess]);

	return (
		<LoginForm
			onSubmit={onSubmit}
		/>
	)
};