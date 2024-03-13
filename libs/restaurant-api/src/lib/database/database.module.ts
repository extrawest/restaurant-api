import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { databaseProviders } from "./database.providers";

@Module({
	imports: [
		MongooseModule.forRoot(
			`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
			{
				dbName: "restaurant-chat",
				connectionName: "restaurant-chat",
				auth: {
					username: process.env.MONGO_INITDB_ROOT_USERNAME,
					password: process.env.MONGO_INITDB_ROOT_PASSWORD,
				},
			}
		)
	],
	providers: [...databaseProviders],
	exports: [...databaseProviders]
})
export class DatabaseModule {}
