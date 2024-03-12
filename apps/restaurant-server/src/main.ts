import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";

async function bootstrap() {
		const app = await NestFactory.create(AppModule);
		const config = new DocumentBuilder()
			.setTitle("Restaurant API")
			.setDescription("The Restaurant API description")
			.setVersion("1.0")
			.addTag("restaurant")
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api", app, document);
		app.use(cookieParser());
		await app.listen(3000);
}
bootstrap();
