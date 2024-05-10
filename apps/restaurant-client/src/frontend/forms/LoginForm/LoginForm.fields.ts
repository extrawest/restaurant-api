import { FormFields } from "libs/ui-core/src/lib/form/Form.types";
import { LoginFormType } from "./LoginForm.schema";

export const loginFormFields: FormFields<LoginFormType> = {
	email: {
		type: "email",
		label: "Email",
		styles: undefined,
		required: true,
	},
	password: {
		type: "password",
		label: "Password",
		styles: undefined,
		required: true,
	}
}