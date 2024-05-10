import { FC } from "react";
import { FormProvider, SubmitErrorHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProps } from "./Form.types";
import FormField from "./FormField";
import { Button } from "@mui/material";
import { FormComponent } from "./Form.styles";

export const Form: FC<FormProps> = ({
	fields,
	schema,
	onSubmit,
	onError
}) => {
	const methods = useForm({
    resolver: yupResolver(schema)
  });
	// onSubmit doesn't work w/o onError callback, so we need to make sure that onErrorDefaultHandler is passed to the form
  const onErrorDefaultHandler: SubmitErrorHandler<any> = (errors, e) => console.log(errors, e);
	return (
		<FormProvider {...methods}>
			<FormComponent onSubmit={methods.handleSubmit(onSubmit, onError || onErrorDefaultHandler)}>
				{Object.entries(fields).map(([fieldName, field]) => (
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