import { Inject, Injectable } from "@nestjs/common";
import { Price } from "./entities";
import { PRICE_REPOSITORY } from "./constants";
import { CreatePriceDTO } from "./dto/create-price.dto";
import { UpdatePriceDTO } from "./dto/update-price.dto";

@Injectable()
export class PricesService {
	constructor(
		@Inject(PRICE_REPOSITORY) private priceRepository: typeof Price,
	) {}

	async createPrice(createPriceDTO: CreatePriceDTO) {
		// create price in stripe
		// create price in our DB
	}

	findAllPrices() {
		return `This action returns all prices`;
	}

	findOnePrice(id: string) {
		return `This action returns a #${id} price`;
	}

	updatePrice(id: string, updatePriceDTO: UpdatePriceDTO) {
		return "";
	}

	deletePrice(id: string) {
		return `This action removes a #${id} price`;
	}
}
