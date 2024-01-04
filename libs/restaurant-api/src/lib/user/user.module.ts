import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './user.service';
import { usersProviders } from './user.providers';
import { UsersController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
