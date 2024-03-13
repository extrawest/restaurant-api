import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards
} from "@nestjs/common";
import { UsersService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../auth/guards/auth.guard";
import { UserDTO } from "./dto/user.dto";
import { Maybe } from "utils";
import { User } from "../decorators/user.decorator";
import { User as UserEntity } from "./entities/user.entity";
import { Public } from "../auth/public-route.decorator";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Public()
	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Post("create")
	create(@Body() createUserDto: CreateUserDto, @User() user?: UserEntity): Promise<UserDTO> {
		return this.usersService.create(createUserDto, user);
	}

	@Roles(Role.Admin)
	@UseGuards(AuthGuard, RolesGuard)
	@Get()
	findAll(): Promise<UserDTO[]> {
		return this.usersService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string): Promise<Maybe<UserDTO>> {
		return this.usersService.findOne(+id);
	}

	@Patch(":id")
	update(@Param("id") id: string, @Body() updateProductDto: UpdateUserDto): Promise<Maybe<UserDTO> | Error> {
		return this.usersService.update(+id, updateProductDto);
	}

	@Roles(Role.Admin)
	@UseGuards(RolesGuard, AuthGuard)
	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.usersService.remove(+id);
	}
}
