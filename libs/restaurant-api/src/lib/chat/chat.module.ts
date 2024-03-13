import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { Message, MessageSchema } from "./schemas/message.schema";
import { AuthModule } from "../auth/auth.module";
import { RoomService } from "./room.service";
import { Room, RoomSchema } from "./schemas/room.schema";
import { ChatController } from "./chat.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from "../config/jwt.config";

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
