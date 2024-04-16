import { PartialType } from "@nestjs/mapped-types";
import { CreatePriceDTO } from "./create-price.dto";
import { OmitType } from "@nestjs/swagger";

export class UpdatePriceDTO extends PartialType(OmitType(CreatePriceDTO, ["productId"])) {}
