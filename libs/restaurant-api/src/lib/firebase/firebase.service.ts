import { Injectable } from "@nestjs/common";
import { Storage, getStorage } from "firebase-admin/storage";
import {
	ServiceAccount,
	cert,
	initializeApp
} from "firebase-admin/app";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FirebaseService {
	private readonly storage: Storage;
	constructor(private configService: ConfigService) {
		const adminConfig: ServiceAccount = {
			projectId: this.configService.get<string>("FIREBASE_PROJECT_ID"),
			privateKey: this.configService
				.get<string>("FIREBASE_PRIVATE_KEY")
				?.replace(/\\n/g, "\n"),
			clientEmail: this.configService.get<string>("FIREBASE_CLIENT_EMAIL")
		};
		initializeApp({
			credential: cert(adminConfig),
			storageBucket: this.configService.get<string>("FIREBASE_STORAGE_BUCKET")
		});
		this.storage = getStorage();
	}

	async uploadFile(file: Express.Multer.File) {
		const bucketFile = await this.storage.bucket().file(`products-images/${file.originalname}`);
		await bucketFile.save(file.buffer);
		await bucketFile.makePublic();
		return bucketFile.publicUrl();
	}
}
