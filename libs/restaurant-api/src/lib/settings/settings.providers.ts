import { SETTINGS_REPOSITORY } from "./constants";
import { Setting } from "./entities";

export const settingsProviders = [
	{
		provide: SETTINGS_REPOSITORY,
		useValue: Setting
	}
];
