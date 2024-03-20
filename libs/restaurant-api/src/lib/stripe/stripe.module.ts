import { Module } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [AuthModule, ConfigModule],
	providers: [StripeService],
})
export class StripeModule {}
