import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
	DatabaseModule,
	AuthModule,
	UsersModule,
	CategoryModule,
	ProductModule,
	QueuesModule,
	CartModule,
	FirebaseModule,
	StripeModule,
	CheckoutModule,
	PaymentModule
} from "restaurant-api";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env"],
			isGlobal: true
		}),
		DatabaseModule,
		AuthModule,
		UsersModule,
		CategoryModule,
		ProductModule,
		QueuesModule,
		CartModule,
		FirebaseModule,
		StripeModule,
		CheckoutModule,
		PaymentModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
