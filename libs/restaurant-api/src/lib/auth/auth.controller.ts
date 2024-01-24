import {
	Body, 
	Controller,
	Post,
	HttpCode,
	HttpStatus
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	@HttpCode(HttpStatus.OK)
	@Post("login")
	signIn(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto.email, signInDto.password);
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
}
