import { Express } from "express";
import "multer";
import { 
	Controller, 
	Post, 
	UploadedFile, 
	UseInterceptors
} from "@nestjs/common";
import { FirebaseService } from "./firebase.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("firebase")
export class FirebaseController {
	constructor(private readonly firebaseService: FirebaseService) {}

	@Post("storage/upload")
	@UseInterceptors(FileInterceptor("file"))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		return this.firebaseService.uploadFile(file);
	}
}
