export interface AuthResponse {
	access_token: string,
};

export type LoginProps = {
	onSubmit: (username: string, password: string) => void;
};