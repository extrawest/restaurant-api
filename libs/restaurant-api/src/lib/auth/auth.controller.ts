import {
	Body, 
	Controller,
	Post,
	HttpCode,
	HttpStatus,
	Req,
	UseGuards,
	Get,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtRefreshAuthGuard } from "./jwt-refresh-auth.guard";
import { User } from "../decorators/user.decorator";
import { User as UserEntity } from "../user/entities/user.entity";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	@HttpCode(HttpStatus.OK)
	@Post("login")
	async signIn(@Req() request: Request, @Body() signInDto: SignInDto) {
		const {
			access_token_cookie,
			refresh_token,
			user
		} = await this.authService.signIn(signInDto.email, signInDto.password);
		request?.res?.setHeader("Set-Cookie", [access_token_cookie, refresh_token.cookie]);
		return user;
	}

	@Post("forgot-password")
	forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		this.authService.forgotPassword(forgotPasswordDto.email);
	}

	@Post("reset-password")
	resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		this.authService.resetPassword(
			resetPasswordDto.password,
			resetPasswordDto.confirmPassword,
			resetPasswordDto.token
		);
	}

	@UseGuards(JwtRefreshAuthGuard)
	@Get("refresh")
	async refresh(@Req() request: Request, @User() user: UserEntity) {
		const {
			access_token_cookie,
			refresh_token,
			user: currentUser
		} = await this.authService.refreshToken(request.cookies.Refresh, user.email);
 
		request.res?.setHeader("Set-Cookie", [access_token_cookie, refresh_token.cookie]);
		return currentUser;
	}
}
