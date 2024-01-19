import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { categoriesProviders } from "./category.providers";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [AuthModule],
	controllers: [CategoryController],
	providers: [CategoryService, ...categoriesProviders]
})
export class CategoryModule {}
