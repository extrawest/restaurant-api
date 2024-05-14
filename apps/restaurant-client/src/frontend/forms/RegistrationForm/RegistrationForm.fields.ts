import type { FormFields } from "ui-core";
import { RegistrationFormType } from "./RegistrationForm.schema";

export const registrationFormFields: FormFields<RegistrationFormType> = {
	name: {
		type: "text",
		label: "Full Name",
		required: true,
	},
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