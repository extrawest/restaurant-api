import { FC } from "react";
import { Form } from "ui-core";
import { useIntl } from "react-intl";
import { loginFormSchema } from "./LoginForm.schema";
import { LoginFormProps } from "./LoginForm.types";
import { loginFormFields } from "./LoginForm.fields";

export const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
	const { $t } = useIntl();
	return (
		<Form
			schema={loginFormSchema}
			fields={loginFormFields}
			onSubmit={onSubmit}
			submitText={$t({ id: "text.submit.login" })}
		/>
	)
};

export default LoginForm;