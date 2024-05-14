"use client";
import { SnackbarProvider } from "notistack";

export const NotificationsProvider = ({ children }: { children: React.ReactNode}) => {
	return (
		<SnackbarProvider>
			{children}
		</SnackbarProvider>
	)
};