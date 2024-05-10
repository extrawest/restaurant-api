import { FC } from "react";
import { Form } from "ui-core";
import { loginFormSchema } from "./LoginForm.schema";
import { LoginFormProps } from "./LoginForm.types";
import { loginFormFields } from "./LoginForm.fields";

export const LoginForm: FC<LoginFormProps> = ({ onSubmit }) => {
	return (
		<Form
			schema={loginFormSchema}
			fields={loginFormFields}
			onSubmit={onSubmit}
		/>
	)
};

export default LoginForm;