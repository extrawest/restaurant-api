import { Model } from "mongoose";
import { faker } from "@faker-js/faker";
import { ROOM_NOT_FOUND } from "shared";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Room } from "./schemas";
import { Message } from "./schemas";
import { ChatService } from "./chat.service";
import { RoomService } from "./room.service";

const roomId = faker.string.uuid();

const room: Room = {
	name: faker.person.fullName(),
	isPrivate: true,
	members: [1, 2],
	messages: [],
};

const message = {
	userId: 1,
	content: faker.word.words(),
	roomId,
};

describe("ChatService", () => {
	let roomService: RoomService;
	let chatService: ChatService;
	let model: Model<Message>;
	let roomModel: Model<Room>;

	beforeEach(async () => {
		jest.resetAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConfigService,
				JwtService,
				RoomService,
				ChatService,
				{
					provide: getModelToken("Message", "restaurant-chat"),
					useValue: {
						create: jest.fn(),
						find: jest.fn()
					}
				},
				{
					provide: getModelToken("Room", "restaurant-chat"),
					useValue: jest.fn()
				},
			],
		}).compile();
		roomService = module.get<RoomService>(RoomService);
		chatService = module.get<ChatService>(ChatService);
		model = module.get<Model<Message>>(getModelToken("Message", "restaurant-chat"));
		roomModel = module.get<Model<Room>>(getModelToken("Room", "restaurant-chat"));
		
	});

	describe("save message method", () => {
		it("should save message", async () => {
			jest.spyOn(roomService, "getRoomById").mockResolvedValueOnce(room);
			jest.spyOn(model, "create").mockImplementationOnce(() => Promise.resolve({
				userId: 1,
				content: faker.word.words(),
				roomId,
			} as any));
			const result = await chatService.saveMessage(faker.word.words(), 1, roomId);
			expect(result).toBeDefined();
			expect(model.create).toHaveBeenCalledTimes(1);
			expect(jest.spyOn(roomService, "getRoomById")).toHaveBeenCalledTimes(1);
		});

		it("should throw ROOM_NOT_FOUND", async () => {
			jest.spyOn(roomService, "getRoomById").mockResolvedValueOnce(null);
			expect(chatService.saveMessage(faker.word.words(), 1, roomId)).rejects.toThrow(new NotFoundException(ROOM_NOT_FOUND));
			expect(jest.spyOn(roomService, "getRoomById")).toHaveBeenCalledTimes(1);
		});
	});

	describe("room messages method", () => {
		it("should return room messages", async () => {
			jest.spyOn(model, "find").mockReturnValue({
				exec: jest.fn().mockResolvedValueOnce([message]),
			} as any);
			const result = await chatService.getRoomMessages(roomId);
			expect(result).toEqual([message]);
			expect(jest.spyOn(model, "find")).toHaveBeenCalledTimes(1);
		});
	});
});
