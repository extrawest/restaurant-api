import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
	AuthModule,
	CartModule,
	ChatModule,
	UsersModule,
	QueuesModule,
	StripeModule,
	PaymentModule,
	ProductModule,
	DatabaseModule,
	CategoryModule,
	CheckoutModule,
	FirebaseModule,
	SettingsModule,
	SubscriptionsModule,
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
		PaymentModule,
		ChatModule,
		SettingsModule,
		SubscriptionsModule,
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
