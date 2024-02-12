import { Module } from "@nestjs/common";
import { FirebaseController } from "./firebase.controller";
import { FirebaseService } from "./firebase.service";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule],
	controllers: [FirebaseController],
	providers: [FirebaseService],
	exports: [FirebaseService]
})
export class FirebaseModule {}
