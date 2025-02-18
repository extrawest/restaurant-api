import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { createTransport } from "nodemailer";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import { Maybe } from "utils";
import {
	PASSWORDS_DO_NOT_MATCH,
	TOKEN_IS_NOT_VALID_OR_EXPIRED,
	USER_NOT_FOUND
} from "shared";
import { UsersService } from "../user/user.service";
import { User } from "../user/entities";

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {};
	async signIn(email: string, password: string) {
		const user = await this.usersService.findOneByEmail(email);
		const isPasswordMatching = await compare(password, user?.password || "");
		if (!isPasswordMatching) {
			throw new UnauthorizedException();
		};
		const access_token = await this.getJwtAccessToken(user);
		const refresh_token = await this.getJwtRefreshToken(user);
		await this.usersService.setCurrentRefreshToken(refresh_token, user?.id);
		return {
			access_token,
			refresh_token,
		};
	};

	// TODO: add Token model to the DB to store forgot pass tokens
	async forgotPassword(email: string) {
		const user = await this.usersService.findOneByEmail(email);
		if (!user) throw new NotFoundException(USER_NOT_FOUND);
		/* eslint-disable function-paren-newline */
		const forgotPasswordToken = this.jwtService.sign(
			{ _id: user.id },
			{
				secret: process.env["FORGOT_PASS_SECRET"],
				expiresIn: "30m"
			}
		);
		const transport = createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: process.env["MAILTRAP_USER"],
				pass: process.env["MAILTRAP_PASSWORD"]
			}
		});
		transport.sendMail({
			from: "restaurant@test.com",
			to: email,
			subject: `Password Reset`,
			html: `
				<h3>Token:</>
				<p><b>${forgotPasswordToken}</b></p>
			`
		});
	};

	async resetPassword(newPassword: string, confirmPassword: string, token: string) {
		const passwordsMathching = newPassword === confirmPassword;
		if (!passwordsMathching)
			throw new BadRequestException(PASSWORDS_DO_NOT_MATCH);
		try {
			const { _id } = this.jwtService.verify(token, {
				secret: process.env["FORGOT_PASS_SECRET"]
			});
			if (_id) {
				const hashedPassword = await hash(newPassword, 10);
				await this.usersService.update(_id, {
					password: hashedPassword
				});
			}
		} catch {
			throw new BadRequestException(TOKEN_IS_NOT_VALID_OR_EXPIRED);
		};
	};

	async refreshToken(refreshToken: string, userEmail: string) {
		const user = await this.usersService.findOneByEmail(userEmail);
		const isRefreshTokenMatching = await compare(
			refreshToken,
			user?.currentHashedRefreshToken as string,
		);
		if (!isRefreshTokenMatching) {
			throw new UnauthorizedException();
		};
		const access_token = await this.getJwtAccessToken(user);
		const refresh_token = await this.getJwtRefreshToken(user);
		await this.usersService.setCurrentRefreshToken(refresh_token, user?.id);
		return {
			access_token,
			refresh_token,
		};
	};

	async getJwtAccessToken(user: Maybe<User>) {
		const payload = { id: user?.id, email: user?.email, role: user?.role };
		return this.jwtService.sign(payload, {
			secret: process.env["JWT_SECRET"],
			expiresIn: "1d"
		});
	}
 
	async getJwtRefreshToken(user: Maybe<User>) {
		const payload = { id: user?.id, email: user?.email, role: user?.role };
		return this.jwtService.sign(payload, {
			secret: process.env["JWT_SECRET"],
			expiresIn: "7d"
		});
	}
};
