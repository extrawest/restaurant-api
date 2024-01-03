import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  async signIn(username: string, hashedPassword: string) {
    const user = await this.usersService.findOneByUsername(username);
    const isPasswordMatching = await bcrypt.compare(
      hashedPassword,
      user?.password || ""
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user?.id, username: user?.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}