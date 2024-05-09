import { FC } from "react";
import { FormFieldProps } from "./Form.types";
import { TextField } from "@mui/material";

export const FormField: FC<FormFieldProps & { name: string }> = ({
	type,
	label,
	required,
}) => {
	if (type === "text") {
		return (
			<TextField
				label={label}
				required={required}
			/>
		)
	};
};

export default FormField;