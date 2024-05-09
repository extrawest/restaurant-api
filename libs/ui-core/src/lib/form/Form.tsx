import { FC } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProps } from "./Form.types";
import FormField from "./FormField";

export const Form: FC<FormProps> = ({
	fields,
	schema,
	onSubmit,
}) => {
	const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{Object.entries(fields).map(([fieldName, field]) => (
				<FormField
					required={field.required}
					type={field.type}
					label={field.label}
					{...register(fieldName)}
				/>
			))}
			
			<input type="submit" />
		</form>
	)
};

export default Form;