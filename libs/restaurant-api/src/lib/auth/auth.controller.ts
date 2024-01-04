import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // TODO: DTO for signInDto
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  // @Post('forgot-password')
  // forgotPassword(email: string) {
  //   this.authService.forgotPassword(email);
  // }

  // @Post('reset-password')
  // resetPassword(password: string, confirmPassword: string, token: string) {
  //   if(password === confirmPassword) {
      
  //   }
  // }
}