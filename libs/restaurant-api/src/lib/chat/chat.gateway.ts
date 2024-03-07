import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { WsJwtAuthGuard } from "./auth.guard";
import { User } from "../decorators/user.decorator";
import { User as UserEntity } from "../user/entities/user.entity";

@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	constructor(private readonly chatService: ChatService) {}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage("message")
	async handleMessage(
		@ConnectedSocket() socket: Socket,
		@MessageBody() messagePayload: { data : { content: string, roomId: string }},
		@User() user: UserEntity
	) {
		const { data } = messagePayload;
		const userId = user.id;
		const message = await this.chatService.saveMessage(data.content, userId, data.roomId);

		socket.to(`room:${data.roomId}`).emit("message", {
			userId: message.userId,
			content: message.content
		});
	};

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage("join-room")
	async joinRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() messagePayload: { data : { roomId: string }}
	) {
		const { data } = messagePayload;
		socket.join(`room:${data.roomId}`);
	};
};
