import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Message } from "./schemas/message.schema";
import { RoomService } from "./room.service";

@Injectable()
export class ChatService {
	constructor(
		@InjectModel(Message.name, "restaurant-chat") private messagesRepository: Model<Message>,
		private readonly roomService: RoomService,
	) {};

	saveMessage(content: string, userId: number, roomId: string): Promise<Message> {
		const room = this.roomService.getRoomById(roomId);
		if (!room) {
			throw new Error("ROOM_NOT_FOUND");
		};
		return new this.messagesRepository({
			content,
			userId,
			roomId
		}).save();
	};
 
	async getRoomMessages(roomId: string) {
		return this.messagesRepository.find({
			roomId
		}).exec();
	};
};
