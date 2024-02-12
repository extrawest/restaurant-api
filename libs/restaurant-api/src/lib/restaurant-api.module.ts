import { Module } from "@nestjs/common";
import { FirebaseModule } from "./firebase/firebase.module";

@Module({
	controllers: [],
	providers: [],
	exports: [],
	imports: [FirebaseModule]
})
export class RestaurantApiModule {}
