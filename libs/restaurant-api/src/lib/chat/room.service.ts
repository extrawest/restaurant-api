import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Maybe } from "utils";
import { Room } from "./schemas";

@Injectable()
export class RoomService {
	constructor(@InjectModel(Room.name, "restaurant-chat") private roomRepository: Model<Room>) {};

	async createPrivateRoom(senderId: number, receiverId: number): Promise<Room> {
		// create room name and make sure the name always the same for both members
		const roomName = senderId > receiverId ?
			`ID_${senderId}-ID_${receiverId}` : `ID_${receiverId}-ID_${senderId}`;
		const roomExist = await this.getRoomByName(roomName);
		if (roomExist) {
			return roomExist;
		};
		return new this.roomRepository({
			members: [senderId, receiverId],
			isPrivate: true,
			name: roomName
		}).save();
	};

	getRooms() {
		return this.roomRepository.find().exec();
	};

	getUserRooms(userId: number) {
		return this.roomRepository.find({
			members: userId
		});
	}

	getRoomById(_id: string): Promise<Maybe<Room>> {
		return this.roomRepository.findOne({ _id }).exec();
	};

	getRoomByName(name: string): Promise<Maybe<Room>> {
		return this.roomRepository.findOne({ name }).exec();
	};
};