import { Sequelize } from 'sequelize-typescript';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'restaurant',
      });
      sequelize.addModels([Category, Product]);
      await sequelize.sync();
      return sequelize;
    },
  },
];