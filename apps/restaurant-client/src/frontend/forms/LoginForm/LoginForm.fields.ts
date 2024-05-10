import { FormFields } from "libs/ui-core/src/lib/form/Form.types";

export const loginFormFields: FormFields = {
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