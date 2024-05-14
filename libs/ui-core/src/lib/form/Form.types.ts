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

export type TranslationLabel = {
	translationId: string;
};

export type LabelType = TranslationLabel | string;

export type FormFieldProps = {
	type: string;
	label?: LabelType;
	styles?: any;
	required?: boolean;
};