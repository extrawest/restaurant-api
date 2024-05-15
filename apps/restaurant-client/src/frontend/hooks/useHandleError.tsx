"use client";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { HandleErrorHookType } from "shared";

export const useHandleError = ({
	trigger,
	text,
}: HandleErrorHookType) => {
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (trigger) {
			enqueueSnackbar({
				message: text,
				variant: "error"
			});
		};
	}, [trigger]);
};