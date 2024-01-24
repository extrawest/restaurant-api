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
	CartModule
} from "restaurant-api";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env", "rabbitmq.env"],
			isGlobal: true
		}),
		DatabaseModule,
		AuthModule,
		UsersModule,
		CategoryModule,
		ProductModule,
		QueuesModule,
		CartModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
