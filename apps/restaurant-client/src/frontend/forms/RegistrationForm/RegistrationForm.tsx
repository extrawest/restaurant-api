import { FC } from "react";
import { Form } from "ui-core";
import { useIntl } from "react-intl";
import { registrationFormSchema } from "./RegistrationForm.schema";
import { RegistrationFormProps } from "./RegistrationForm.types";
import { getRegistrationFormFields } from "./RegistrationForm.fields";

export const RegistrationForm: FC<RegistrationFormProps> = ({ onSubmit }) => {
	const { $t } = useIntl();
	return (
		<Form
			schema={registrationFormSchema}
			fields={getRegistrationFormFields()}
			onSubmit={onSubmit}
			submitText={$t({ id: "text.submit.register" })}
		/>
	)
};

export default RegistrationForm;