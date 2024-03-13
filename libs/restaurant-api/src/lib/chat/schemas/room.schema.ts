import {
	Prop,
	Schema,
	SchemaFactory
} from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { MessageSchema } from "./message.schema";

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true, default: true})
	isPrivate: boolean;

	@Prop({ required: true, maxlength: 2 })
	members: number[];

	@Prop({ type: MessageSchema })
	messages: (typeof MessageSchema)[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);