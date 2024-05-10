import * as yup from "yup";
import { SubmitErrorHandler } from "react-hook-form";

export type FormProps<T> = {
	schema: yup.ObjectSchema<any>;
	fields: FormFields<T>;
	onSubmit: (data: T) => void;
	onError?: SubmitErrorHandler<any>;
};

export type FormFields<T> = {
	[K in keyof T]: FormFieldProps;
};

export type FormFieldProps = {
	type: string;
	label?: string;
	styles?: any;
	required?: boolean;
};