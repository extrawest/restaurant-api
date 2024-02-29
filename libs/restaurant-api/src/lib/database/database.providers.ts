import { Sequelize } from "sequelize-typescript";
import * as pg from "pg";
import { Category } from "../category/entities/category.entity";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Order } from "../order/entities/order.entity";
import { Cart } from "../cart/entities/cart.entity";
import { CartItem } from "../cart/entities/item.entity";
import { Payment } from "../payment/entities/payment.entity";
import { PaymentMethod } from "../payment/entities/payment-method.entity";

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
				Category,
				Product,
				User,
				Cart,
				Order,
				CartItem,
				Payment,
				PaymentMethod
			]);
			await sequelize.sync({ alter: true });
			return sequelize;
		}
	}
];
