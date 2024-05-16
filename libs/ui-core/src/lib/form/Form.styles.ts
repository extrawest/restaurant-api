import { styled } from "@mui/material";

export const FormComponent = styled("form")(() => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	"& > .MuiFormControl-root + .MuiFormControl-root, & > .MuiFormControl-root + .MuiButton-root": {
		marginTop: 15
	},
}));