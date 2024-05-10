import { SubmitHandler } from "react-hook-form";
import { LoginFormType } from "./LoginForm.schema";

export type LoginFormProps = {
	onSubmit: SubmitHandler<LoginFormType>;
};