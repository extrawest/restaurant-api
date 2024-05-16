import type { FormFields } from "ui-core";
import { LoginFormType } from "./LoginForm.schema";

export const loginFormFields: FormFields<LoginFormType> = {
	email: {
		type: "email",
		label: {
			translationId: "text.email"
		},
		styles: undefined,
		required: true,
	},
	password: {
		type: "password",
		label: {
			translationId: "text.password"
		},
		styles: undefined,
		required: true,
	}
}