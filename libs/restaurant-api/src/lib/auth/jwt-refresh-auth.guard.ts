import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { compare } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UsersService } from "../user/user.service";

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private usersService: UsersService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const refresh_token = this.extractRefreshTokenFromHeader(request);
		if (!refresh_token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(refresh_token, {
				secret: this.configService.get<string>("JWT_SECRET")
			});
			const user = await this.usersService.findOneByEmail(payload.email);
			const isRefreshTokenMatching = await compare(
				refresh_token,
				user?.currentHashedRefreshToken as string,
			);

			if (!isRefreshTokenMatching) {
				throw new UnauthorizedException();
			};
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request["user"] = payload;
			request.headers["refresh_token"] = refresh_token;
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}

	private extractRefreshTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}
}
