import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormFieldProps, FormProps } from "./Form.types";
import FormField from "./FormField";
import { Button } from "@mui/material";
import { FormComponent } from "./Form.styles";

export const Form = <T extends object>({
	fields,
	schema,
	onSubmit,
	onError
}: FormProps<T>) => {
	const methods = useForm<T>({
    resolver: yupResolver(schema)
  });
	// onSubmit doesn't work w/o onError callback, so we need to make sure that at least onErrorDefaultHandler is passed to the form if onError is undefined
  const onErrorDefaultHandler: SubmitErrorHandler<T> = (errors, e) => console.log(errors, e);
	return (
		<FormProvider {...methods}>
			<FormComponent onSubmit={methods.handleSubmit(onSubmit, onError || onErrorDefaultHandler)}>
				{Object.entries<FormFieldProps>(fields).map(([fieldName, field]) => (
					<FormField
						name={fieldName}
						key={fieldName}
						required={field.required}
						type={field.type}
						label={field.label}
					/>
				))}
				<Button type="submit">
					Login
				</Button>
			</FormComponent>
		</FormProvider>
	)
};

export default Form;