import { SubmitHandler } from "react-hook-form";
import { RegistrationFormType } from "./RegistrationForm.schema";

export type RegistrationFormProps = {
	onSubmit: SubmitHandler<RegistrationFormType>;
};