import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { createTransport } from "nodemailer";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common";
import {
	PASSWORDS_DO_NOT_MATCH,
	TOKEN_IS_NOT_VALID_OR_EXPIRED,
	USER_NOT_FOUND
} from "shared";
import { UsersService } from "../user/user.service";

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private jwtService: JwtService) {};
	async signIn(email: string, password: string) {
		const user = await this.usersService.findOneByEmail(email);
		const isPasswordMatching = await compare(password, user?.password || "");
		if (!isPasswordMatching) {
			throw new UnauthorizedException();
		}
		const payload = {
			id: user?.id,
			email: user?.email,
			role: user?.role,
			stripeCustomerId: user?.stripeCustomerId
		};
		return {
			access_token: await this.jwtService.signAsync(payload)
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
};
