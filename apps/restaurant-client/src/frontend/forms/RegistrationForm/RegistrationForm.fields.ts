import type { FormFields } from "ui-core";
import { RegistrationFormType } from "./RegistrationForm.schema";

export const registrationFormFields: FormFields<RegistrationFormType> = {
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