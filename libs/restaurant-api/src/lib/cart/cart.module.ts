import { Module, forwardRef } from "@nestjs/common";
import { CartService } from "./cart.service";
import { CartController } from "./cart.controller";
import { cartProviders } from "./cart.providers";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [forwardRef(() => AuthModule)],
	providers: [CartService, ...cartProviders],
	controllers: [CartController],
	exports: [CartService]
})
export class CartModule {}
