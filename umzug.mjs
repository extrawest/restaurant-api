import dotenv from 'dotenv'
dotenv.config()
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
	dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// TODO: rename create admin user migrations
export const migrator = new Umzug({
	migrations: {
		glob: './migrations/*.mjs',
	},
	context: sequelize,
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
});

migrator.runAsCLI();
// export type Migration = typeof migrator._types.migration;
