import { JwtService } from "@nestjs/jwt";
import { io, Socket } from "socket.io-client";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { CanActivate, INestApplication } from "@nestjs/common";
import { WsJwtAuthGuard } from "../auth";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import DoneCallback = jest.DoneCallback;

const chatServiceMock = {
	saveMessage: jest.fn(),
	getRoomMessages: jest.fn()
};

describe("ChatGateway", () => {
	let gateway: ChatGateway;
	let app: INestApplication;
	let ioClient: Socket;

	beforeEach(async () => {
		jest.resetAllMocks();
		const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConfigService,
				JwtService,
				ChatGateway,
				{
					provide: getModelToken("Message"),
					useValue: jest.fn()
				},
				{ provide: ChatService, useValue: chatServiceMock },
			],
		})
			.overrideGuard(WsJwtAuthGuard)
			.useValue(mockGuard)
			.compile();
		app = module.createNestApplication();
		gateway = app.get<ChatGateway>(ChatGateway);
		await app.listen(3000);
	});

	afterEach(async () => {
		ioClient?.close();
		await app.close();
	});

	it("should connect to the WS", (done: DoneCallback) => {
		ioClient = io("http://localhost:3000");
		ioClient.on("connect", () => {
			done();
		});
		ioClient.on("connect_error", (error: Error) => done(error));
	});

	it.skip("should handle message event", (done: DoneCallback) => {
		const message = {
			data: {
				userId: 1,
				content: "content",
				roomId: "roomId"
			}
		};
		chatServiceMock.saveMessage.mockResolvedValueOnce(message.data);
		ioClient = io("http://localhost:3000");
		ioClient.on("connect", () => {
			gateway.server.on("message", (data) => {
				expect(data).toEqual(message);
				done();
			});
			setTimeout(() => ioClient.emit("message", message), 200);
		});
		ioClient.on("connect_error", (error: Error) => done(error));
	});
});
