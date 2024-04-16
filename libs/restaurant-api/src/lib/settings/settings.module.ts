import { Module } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { settingsProviders } from "./settings.providers";
import { SettingsController } from "./settings.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [JwtModule],
	controllers: [SettingsController],
	providers: [SettingsService, ...settingsProviders],
	exports: [SettingsService]
})
export class SettingsModule {}
