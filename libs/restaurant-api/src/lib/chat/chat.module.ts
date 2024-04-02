import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { RoomService } from "./room.service";
import { Room, RoomSchema } from "./schemas";
import { jwtConfig } from "../config/jwt.config";
import { AuthModule } from "../auth/auth.module";
import { ChatController } from "./chat.controller";
import { Message, MessageSchema } from "./schemas";

@Module({
	imports: [
		JwtModule.registerAsync(jwtConfig),
		AuthModule,
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema },
			{ name: Room.name, schema: RoomSchema}
		], "restaurant-chat")
	],
	controllers: [ChatController],
	providers: [ChatGateway, ChatService, RoomService],
})
export class ChatModule {}
