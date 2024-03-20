import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	UseGuards
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { RoomService } from "./room.service";
import { User } from "../decorators/user.decorator";
import { User as UserEntity } from "../user/entities/user.entity";
import { AuthGuard } from "../auth";
import { RolesGuard } from "../auth/roles.guard";
import { Role } from "../enums/role.enum";
import { Roles } from "../auth/roles.decorator";

@Controller("chat")
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private readonly roomService: RoomService
	) {}

	@UseGuards(AuthGuard)
	@Post("room")
	createRoom(@User() user: UserEntity, @Body() data: { receiverId: number }) {
		return this.roomService.createPrivateRoom(user.id, data.receiverId);
	};

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Get("rooms")
	getRooms() {
		return this.roomService.getRooms();
	};

	@UseGuards(AuthGuard, RolesGuard)
	@Get("rooms/user/:id")
	geUserRooms(@Param("id") id: string) {
		return this.roomService.getUserRooms(+id);
	};

	@Get("room/messages")
	getRoomMessages(roomId: string) {
		return this.chatService.getRoomMessages(roomId);
	};
}