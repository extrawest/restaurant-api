import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { productsProviders } from "./product.providers";
import { AuthModule } from "../auth/auth.module";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
	imports: [AuthModule, FirebaseModule],
	controllers: [ProductController],
	providers: [ProductService, ...productsProviders]
})
export class ProductModule {}
