import { hash } from "bcrypt";
import {
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { Maybe } from "utils";
import { CURRENT_USER_DOES_NOT_HAVE_PERMISSIONS_TO_CREATE_ADMIN, USER_NOT_FOUND } from "shared";
import { User } from "./entities";
import { Role } from "../enums/role.enum";
import { USERS_REPOSITORY } from "./constants";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { StripeService } from "../stripe/stripe.service";

@Injectable()
export class UsersService {
	constructor(
		@Inject(USERS_REPOSITORY) private usersRepository: typeof User,
		private stripeService: StripeService
	) {}
	async create(userData: CreateUserDto, user?: User) {
		const stripeCustomer = await this.stripeService.createCustomer(userData.name, userData.email);
		if (userData.role === Role.Admin && user?.role !== Role.Admin) {
			throw new UnauthorizedException(CURRENT_USER_DOES_NOT_HAVE_PERMISSIONS_TO_CREATE_ADMIN);
		};
		const hashedPassword = await hash(userData.password, 10);
		const createdUser = await this.usersRepository.create<User>({
			...userData,
			stripeCustomerId: stripeCustomer.id,
			password: hashedPassword,
			role: user?.role === Role.Admin ? userData.role : Role.Buyer
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
			where: { email }
		});
	}

	findOneByStripeCustomerId(stripeCustomerId: string) {
		return this.usersRepository.findOne({
			where: {
				stripeCustomerId,
			}
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
				throw new NotFoundException(USER_NOT_FOUND);
			});
	}

	remove(id: number) {
		return this.usersRepository.destroy({ where: { id } });
	}

	async setCurrentRefreshToken(refreshToken: string, userId: number) {
		const currentHashedRefreshToken = await hash(refreshToken, 10);
		this.update(userId, { currentHashedRefreshToken });
	}
}
