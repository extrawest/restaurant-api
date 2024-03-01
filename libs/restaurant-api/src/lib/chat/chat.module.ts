import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { Message, MessageSchema } from "./schemas/message.schema";
import { AuthModule } from "../auth/auth.module";
import { RoomService } from "./room.service";
import { Room, RoomSchema } from "./schemas/room.schema";
import { ChatController } from "./chat.controller";

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema },
			{ name: Room.name, schema: RoomSchema}
		])
	],
	controllers: [ChatController],
	providers: [ChatGateway, ChatService, RoomService],
})
export class ChatModule {}
