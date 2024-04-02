import * as pg from "pg";
import { Cart } from "../cart/entities";
import { User } from "../user/entities";
import { Order } from "../order/entities";
import { Address } from "../order/entities";
import { Payment } from "../payment/entities";
import { Product } from "../product/entities";
import { Setting } from "../settings/entities";
import { Category } from "../category/entities";
import { Sequelize } from "sequelize-typescript";
import { PaymentMethod } from "../payment/entities";
import { UserAdditionalInfo } from "../user/entities/additionalInfo.entity";

export const databaseProviders = [
	{
		provide: "SEQUELIZE",
		useFactory: async () => {
			const sequelize = new Sequelize({
				dialect: "postgres",
				host: process.env.DB_HOST,
				port: Number(process.env.DB_PORT),
				username: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
				dialectModule: pg
			});
			sequelize.addModels([
				Address,
				Category,
				Product,
				User,
				Cart,
				Order,
				Payment,
				PaymentMethod,
				UserAdditionalInfo,
				Setting
			]);
			await sequelize.sync({ alter: true });
			return sequelize;
		}
	}
];
