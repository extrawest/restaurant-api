import { FC } from "react";
import { Form } from "ui-core";
import { registrationFormSchema } from "./RegistrationForm.schema";
import { RegistrationFormProps } from "./RegistrationForm.types";
import { registrationFormFields } from "./RegistrationForm.fields";

export const RegistrationForm: FC<RegistrationFormProps> = ({ onSubmit }) => {
	return (
		<Form
			schema={registrationFormSchema}
			fields={registrationFormFields}
			onSubmit={onSubmit}
		/>
	)
};

export default RegistrationForm;