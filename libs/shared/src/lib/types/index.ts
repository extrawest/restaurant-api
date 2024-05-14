import { Role } from "../enums";

export interface AuthResponse {
	access_token: string,
};

export type LoginProps = {
	onSubmit: (username: string, password: string) => void;
};

export type User = {
	id: number;
	name: string;
	email: string;
	role: Role;
	stripeCustomerId: string;
	currentHashedRefreshToken: string;
	additional_info?: object;
};

export type HandleErrorHookType = {
	trigger: boolean;
	text: string;
};