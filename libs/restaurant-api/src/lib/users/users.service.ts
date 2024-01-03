import { Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from './constants';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User
  ) {}
  create(userData: CreateUserDto) {
    return this.usersRepository.create<User>(userData);
  }

  findAll() {
    return this.usersRepository.findAll<User>();
  }

  findOne(id: number) {
    return this.usersRepository.findOne<User>({ where: { id }});
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return (await this.usersRepository.findOne<User>({ where: { id }})).update(updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.destroy({ where: { id }});
  }
}