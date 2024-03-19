import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ROOM_NOT_FOUND } from "shared";
import { RoomService } from "./room.service";
import { Message } from "./schemas/message.schema";

@Injectable()
export class ChatService {
	constructor(
		@InjectModel(Message.name, "restaurant-chat") private messagesRepository: Model<Message>,
		private readonly roomService: RoomService,
	) {};

	async saveMessage(content: string, userId: number, roomId: string): Promise<Message> {
		const room = await this.roomService.getRoomById(roomId);
		if (!room) {
			throw new NotFoundException(ROOM_NOT_FOUND);
		};
		return this.messagesRepository.create({
			content,
			userId,
			roomId
		});
	};
 
	async getRoomMessages(roomId: string) {
		return this.messagesRepository.find({
			roomId
		}).exec();
	};
};
