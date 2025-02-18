import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";

async function bootstrap() {
		const app = await NestFactory.create(AppModule, {
			rawBody: true
		});
		const config = new DocumentBuilder()
			.setTitle("Restaurant API")
			.setDescription("The Restaurant API description")
			.setVersion("1.0")
			.addTag("restaurant")
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api", app, document);
		await app.listen(3000);
}
bootstrap();
