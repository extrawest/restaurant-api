import type { FormFields } from "ui-core";
import { RegistrationFormType } from "./RegistrationForm.schema";

export const getRegistrationFormFields = (): FormFields<RegistrationFormType> => {
	return {
		name: {
			type: "text",
			label: {
				translationId: "text.full_name"
			},
			required: true,
		},
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
}