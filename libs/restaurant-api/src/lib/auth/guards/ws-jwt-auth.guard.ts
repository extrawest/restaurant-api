import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private configService: ConfigService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient();
		const token = this.extractTokenFromHeader(client);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>("JWT_SECRET")
			});
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			context.switchToHttp().getRequest().user = payload;
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(client: Socket): string | undefined {
		const [type, token] = (client.handshake.headers["access_token"] as string)?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}
}
