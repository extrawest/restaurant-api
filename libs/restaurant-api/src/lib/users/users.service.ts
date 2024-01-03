import * as bcrypt from "bcrypt";
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
  async create(userData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser = await this.usersRepository.create<User>({
      ...userData,
      password: hashedPassword
    });
    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }

  findAll() {
    return this.usersRepository.findAll<User>();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne<User>({ where: { id }});
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne<User>({ where: { username }});
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User | Error> {
    return this.usersRepository.findOne<User>({ where: { id }}).then((item) => {
      if (item)
        item?.update(updateUserDto)
      return new Error("User not found")
    })
  }

  remove(id: number) {
    return this.usersRepository.destroy({ where: { id }});
  }
}