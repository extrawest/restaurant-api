import { useIntl } from "react-intl";
import { Button } from "@mui/material";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form";
import FormField from "./FormField";
import { FormComponent } from "./Form.styles";
import { FormFieldProps, FormProps } from "./Form.types";

export const Form = <T extends object>({
	fields,
	schema,
	onSubmit,
	onError
}: FormProps<T>) => {
	const { $t } = useIntl();

	const methods = useForm<T>({
    resolver: yupResolver(schema)
  });

	// onSubmit doesn't work w/o onError callback, so we need to make sure that at least onErrorDefaultHandler is passed to the form if onError is undefined
  const onErrorDefaultHandler: SubmitErrorHandler<T> = (errors, e) => console.log(errors, e);

	return (
		<FormProvider {...methods}>
			<FormComponent onSubmit={methods.handleSubmit(onSubmit, onError || onErrorDefaultHandler)}>
				{Object.entries<FormFieldProps>(fields).map(([fieldName, field]) => {
					const label = typeof field.label === "string" ? field.label : $t({ id: field.label?.translationId });
					return (
						<FormField
							name={fieldName}
							key={fieldName}
							required={field.required}
							type={field.type}
							label={label}
						/>
					)
				})}
				<Button type="submit">
					{$t({ id: "text.login" })}
				</Button>
			</FormComponent>
		</FormProvider>
	)
};

export default Form;