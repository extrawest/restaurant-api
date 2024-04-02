import { 
	Controller, 
	Get, 
	Post, 
	Body, 
	Patch, 
	Param, 
	Delete, 
	UseGuards
} from "@nestjs/common";
import { AuthGuard } from "../auth";
import { Role } from "../enums/role.enum";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { SettingsService } from "./settings.service";
import { CreateSettingDto } from "./dto/create-setting.dto";
import { UpdateSettingDto } from "./dto/update-setting.dto";

@Controller("settings")
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Post()
	create(@Body() createSettingDto: CreateSettingDto) {
		return this.settingsService.create(createSettingDto);
	}

	@Get()
	findAll() {
		return this.settingsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.settingsService.findOneById(+id);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateSettingDto: UpdateSettingDto) {
		return this.settingsService.update(+id, updateSettingDto);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.settingsService.remove(+id);
	}
}
