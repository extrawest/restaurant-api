import * as yup from "yup";

export type FormProps = {
	schema: yup.ObjectSchema<any>;
	fields: FormFields;
	onSubmit: (data: any) => void
};

export type FormFields = {
	[fieldName: string]: FormFieldProps;
}

export type FormFieldProps = {
	type: string;
	label?: string;
	required?: boolean;
};