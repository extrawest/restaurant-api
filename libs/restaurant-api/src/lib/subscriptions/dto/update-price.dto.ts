import { PartialType } from "@nestjs/mapped-types";
import { CreatePriceDTO } from "./create-price.dto";

export class UpdatePriceDTO extends PartialType(CreatePriceDTO) {}
