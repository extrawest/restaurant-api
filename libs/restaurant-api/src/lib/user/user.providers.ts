import { USERS_REPOSITORY } from "./constants";
import { User } from "./entities";

export const usersProviders = [
	{
		provide: USERS_REPOSITORY,
		useValue: User
	}
];
