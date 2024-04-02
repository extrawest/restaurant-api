import { Module } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { settingsProviders } from "./settings.providers";
import { SettingsController } from "./settings.controller";

@Module({
	controllers: [SettingsController],
	providers: [SettingsService, ...settingsProviders],
})
export class SettingsModule {}
