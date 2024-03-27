import { 
	BadRequestException, 
	Inject, 
	Injectable 
} from "@nestjs/common";
import { SETTINGS_ITEM_ALREADY_EXISTS, SETTINGS_ITEM_DOES_NOT_EXIST } from "shared";
import { Setting } from "./entities";
import { SETTINGS_REPOSITORY } from "./constants";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { CreateSettingDto } from "./dto/create-setting.dto";

@Injectable()
export class SettingsService {
	constructor(@Inject(SETTINGS_REPOSITORY) private settingsRepository: typeof Setting) {}
	async create(createSettingDto: CreateSettingDto) {
		const setting = await this.findOneByName(createSettingDto.name);
		if (setting) {
			throw new BadRequestException(SETTINGS_ITEM_ALREADY_EXISTS);
		};
		return this.settingsRepository.create<Setting>({
			name: createSettingDto.name,
			data: createSettingDto.data
		});
	}

	findAll() {
		return this.settingsRepository.findAll();
	}

	findOneById(id: number) {
		return this.settingsRepository.findOne({
			where: {
				id
			}
		});
	}

	findOneByName(name: string) {
		return this.settingsRepository.findOne({
			where: {
				name
			}
		});
	}

	async update(id: number, updateSettingDto: UpdateSettingDto) {
		const setting = await this.findOneById(id);
		if (!setting) {
			throw new BadRequestException(SETTINGS_ITEM_DOES_NOT_EXIST);
		};
		return setting.update(updateSettingDto);
	}

	remove(id: number) {
		return this.settingsRepository.destroy({
			where: {
				id
			}
		});
	}
}
