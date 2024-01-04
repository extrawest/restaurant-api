import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { User } from "../user/entities/user.entity";
// import { createTransport } from "nodemailer";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    const isPasswordMatching = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user?.id, email: user?.email, role: user?.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // async forgotPassword(email: string) {
  //   const user = await this.usersService.findOneByEmail(email);
  //   if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   const forgotPasswordToken = this.jwtService.sign(
  //     { _id: user.id },
  //     {
  //       secret: process.env.FORGOT_PASS_SECRET,
  //       expiresIn: "30m"
  //     }
  //   );
  //   const transport = createTransport({
  //     host: "sandbox.smtp.mailtrap.io",
  //     port: 2525,
  //     auth: {
  //       user: "e9946df28064c6",
  //       pass: "639edc2ade95dc"
  //     }
  //   });
  //   transport.sendMail({
  //     from: "restaurant@test.com",
  //     to: email,
  //     subject: `Password Reset`,
  //     html: `
  //       <h3>Token:</>
  //       <p><b>${forgotPasswordToken}</b></p>
  //     `
  //   })
  // }

  // async resetPassword(newPassword: string, confirmPassword: string, token: string) {
  //   const passwordsMathching = newPassword === confirmPassword;
  //   if (!passwordsMathching) throw new HttpException('Passwords do NOT match!', HttpStatus.BAD_REQUEST);
  //   this.jwtService.verifyAsync(token, { secret: process.env.FORGOT_PASS_SECRET }).then(res => {
  //     console.log(res)
  //   })
  //   .catch(() => {
  //     throw new HttpException('Token is not valid or expired', HttpStatus.BAD_REQUEST);
  //   })
  // }
}