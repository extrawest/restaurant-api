import { FC } from "react";
import { TextField } from "@mui/material";
import { FormFieldProps } from "./Form.types";
import { useFormContext } from "react-hook-form";

export const FormField: FC<FormFieldProps & { name: string}> = ({
	name,
	type,
	label,
	required,
}) => {
	const { register } = useFormContext();
	// use this to separate different types of inputs, for now they just have the same field form
	if (
		type === "text" ||
		type === "email" ||
		type === "password"
	) {
		return (
			<TextField
				type={type}
				label={label}
				required={required}
				{...register(name)}
			/>
		)
	};
	return (
		<TextField
			type={type}
			label={label}
			required={required}
			{...register(name)}
		/>
	);
};

export default FormField;