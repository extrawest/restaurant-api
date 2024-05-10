import { SubmitErrorHandler } from "react-hook-form";
import * as yup from "yup";

export type FormProps = {
	schema: yup.ObjectSchema<any>;
	fields: FormFields;
	onSubmit: (data: any) => void;
	onError?: SubmitErrorHandler<any>;
};

export type FormFields = {
	[fieldName: string]: FormFieldProps;
}

export type FormFieldProps = {
	type: string;
	label?: string;
	styles?: any;
	required?: boolean;
};