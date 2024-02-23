import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	ConnectedSocket,
	OnGatewayConnection
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private readonly chatService: ChatService,
	) {}

	handleConnection(client: Socket) {
		console.log(`Client #${client.id} connected`);
	}

	@SubscribeMessage("message")
	async handleMessage(
		@ConnectedSocket() socket: Socket,
		@MessageBody() messagePayload: { data : { content: string, roomId: string }},
	) {
		const { data } = messagePayload;
		const token = socket.handshake.headers.access_token as string;
		const payload = await this.jwtService.verifyAsync(token, {
			secret: this.configService.get<string>("JWT_SECRET")
		});
		const userId = payload.id;
		const message = await this.chatService.saveMessage(data.content, userId, data.roomId);

		socket.to(`room:${data.roomId}`).emit("message", {
			userId: message.userId,
			content: message.content
		});
	};

	@SubscribeMessage("join-room")
	async joinRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() messagePayload: { data : { roomId: string }}
	) {
		const { data } = messagePayload;
		socket.join(`room:${data.roomId}`);
	};
};
