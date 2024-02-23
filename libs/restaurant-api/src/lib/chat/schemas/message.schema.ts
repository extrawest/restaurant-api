import {
	Prop,
	Schema,
	SchemaFactory
} from "@nestjs/mongoose";
import {
	HydratedDocument,
	SchemaTypes,
	ObjectId
} from "mongoose";

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
	@Prop({ required: true })
	userId: number;

	@Prop({ required: true })
	content: string;

	@Prop({ ref: "Room", type: SchemaTypes.ObjectId })
	roomId: ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);