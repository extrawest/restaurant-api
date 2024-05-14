import { FC } from "react";
import { Form } from "ui-core";
import { registrationFormSchema } from "./RegistrationForm.schema";
import { RegistrationFormProps } from "./RegistrationForm.types";
import { getRegistrationFormFields } from "./RegistrationForm.fields";

export const RegistrationForm: FC<RegistrationFormProps> = ({ onSubmit }) => {
	return (
		<Form
			schema={registrationFormSchema}
			fields={getRegistrationFormFields()}
			onSubmit={onSubmit}
		/>
	)
};

export default RegistrationForm;