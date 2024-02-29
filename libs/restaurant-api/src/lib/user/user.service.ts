import { hash } from "bcrypt";
import { Inject, Injectable } from "@nestjs/common";
import { USERS_REPOSITORY } from "./constants";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "../enums/role.enum";
import { Maybe } from "utils";
import { StripeService } from "../stripe/stripe.service";

@Injectable()
export class UsersService {
	constructor(
		@Inject(USERS_REPOSITORY) private usersRepository: typeof User,
		private stripeService: StripeService
	) {}
	async create(userData: CreateUserDto) {
		const stripeCustomer = await this.stripeService.createCustomer(userData.name, userData.email);
		const hashedPassword = await hash(userData.password, 10);
		const createdUser = await this.usersRepository.create<User>({
			...userData,
			stripeCustomerId: stripeCustomer.id,
			password: hashedPassword,
			role: Role.Buyer
		});
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { password, ...userWithoutPassword } = createdUser;
		return userWithoutPassword;
	}

	findAll() {
		return this.usersRepository.findAll<User>({
			attributes: { exclude: ["password"] }
		});
	}

	findOne(id: number): Promise<Maybe<User>> {
		return this.usersRepository.findOne<User>({
			where: { id },
			attributes: { exclude: ["password"] }
		});
	}

	findOneByEmail(email: string): Promise<Maybe<User>> {
		return this.usersRepository.findOne<User>({
			where: { email },
			attributes: { exclude: ["password"] }
		});
	}

	update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
		return this.usersRepository
			.findOne<User>({
				where: { id },
				attributes: { exclude: ["password"] }
			})
			.then((item) => {
				if (item) {
					return item?.update(updateUserDto);
				}
				throw new Error("USER_NOT_FOUND");
			});
	}

	remove(id: number) {
		return this.usersRepository.destroy({ where: { id } });
	}
}
