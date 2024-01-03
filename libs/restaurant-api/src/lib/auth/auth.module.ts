import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';

// export const jwtConfig: JwtModuleAsyncOptions = {
//   useFactory: () => ({
//     global: true,
//     secret: process.env.JWT_SECRET,
//     signOptions: { expiresIn: '1d' },
//   })
// }
@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    UsersModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}