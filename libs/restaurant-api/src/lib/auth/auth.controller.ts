import {
	Body, 
	Controller,
	Post,
	HttpCode,
	HttpStatus
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	// TODO: DTO for signInDto
	@HttpCode(HttpStatus.OK)
	@Post("login")
	/* eslint-disable @typescript-eslint/no-explicit-any */
	signIn(@Body() signInDto: Record<string, any>) {
		return this.authService.signIn(signInDto.email, signInDto.password);
	}

	@Post("forgot-password")
	/* eslint-disable @typescript-eslint/no-explicit-any */
	forgotPassword(@Body() forgotPasswordDto: Record<string, any>) {
		this.authService.forgotPassword(forgotPasswordDto.email);
	}

	@Post("reset-password")
	/* eslint-disable @typescript-eslint/no-explicit-any */
	resetPassword(@Body() resetPasswordDto: Record<string, any>) {
		this.authService.resetPassword(
			resetPasswordDto.password,
			resetPasswordDto.confirmPassword,
			resetPasswordDto.token
		);
	}
}
