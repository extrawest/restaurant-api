import {
	Body, 
	Controller,
	Post,
	HttpCode,
	HttpStatus,
	Req,
	UseGuards,
	Get,
	Header,
	Headers
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
			access_token,
			refresh_token,
		} = await this.authService.signIn(signInDto.email, signInDto.password);
		return {
			access_token,
			refresh_token
		};
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
	async refresh(@Headers("refresh_token") refresh_token: string, @User() user: UserEntity) {
		const {
			access_token,
			refresh_token: new_refresh_token,
		} = await this.authService.refreshToken(refresh_token, user.email);
 
		return {
			access_token,
			new_refresh_token
		};
	}
}
