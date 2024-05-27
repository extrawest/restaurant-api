### List of Tools

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![NextJS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-4DB33D?style=flat&logo=mongodb&logoColor=FFFFFF)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![Nx](https://img.shields.io/badge/workspace-143157?style=for-the-badge&logo=NX&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCB2B?style=for-the-badge&logo=firebase&logoColor=333333)

# Restaurant application

Welcome to the Restaurant Full-Stack Application! This project is designed to provide a seamless and efficient way for users to browse, order, and receive food from their favorite restaurants. It combines a robust backend with an intuitive frontend, ensuring a smooth experience for both customers and restaurant staff.

### Features
- User Registration and Authentication: Secure user registration and login functionality.
- Restaurant Browsing: Users can explore various restaurants and their menus.
- Food Ordering: Easy and quick food ordering process with a user-friendly interface.
- Order Tracking: Order status updates and tracking.
- Payment Integration: Secure payment gateway integration for hassle-free transactions.
- Food Delivery: Efficient food delivery management system ensuring timely deliveries.

## Demo

## Development server

For Next.js, Node.js version >= v18.17.0 is required.

`yarn install`

`docker-compose up -d` to run mongo, postgres, rabbit-mq

`yarn start-server` to run server

`yarn start-client` to run client

Navigate to http://localhost:3002/. The app will automatically reload if you change any of the source files.

## Env variables

```bash
JWT_SECRET=<JWT_SECRET>
FORGOT_PASS_SECRET=<FORGOT_PASS_SECRET>
MAILTRAP_USER=<MAILTRAP_USER>
MAILTRAP_PASSWORD=<MAILTRAP_PASSWORD>
DB_HOST=<DB_HOST>
DB_PORT=<DB_PORT>
DB_USERNAME=<DB_USERNAME>
DB_PASSWORD=<DB_PASSWORD>
DB_NAME=<DB_NAME>
RABBITMQ_DEFAULT_USER=<RABBITMQ_DEFAULT_USER>
RABBITMQ_DEFAULT_PASS=<RABBITMQ_DEFAULT_PASS>
RABBITMQ_HOST=<RABBITMQ_HOST>
FIREBASE_PROJECT_ID=<FIREBASE_PROJECT_ID>
FIREBASE_CLIENT_EMAIL=<FIREBASE_CLIENT_EMAIL>
FIREBASE_PRIVATE_KEY=<FIREBASE_PRIVATE_KEY>
FIREBASE_STORAGE_BUCKET=<FIREBASE_STORAGE_BUCKET>
MONGO_INITDB_ROOT_USERNAME=<MONGO_INITDB_ROOT_USERNAME>
MONGO_INITDB_ROOT_PASSWORD=<MONGO_INITDB_ROOT_PASSWORD>
MONGO_PORT=<MONGO_PORT>
MONGO_HOST=<MONGO_HOST>
STRIPE_SECRET_KEY=<STRIPE_SECRET_KEY>
STRIPE_WEBHOOK_SECRET=<STRIPE_WEBHOOK_SECRET>
JWT_ACCESS_TOKEN_EXPIRATION_TIME=<JWT_ACCESS_TOKEN_EXPIRATION_TIME>
JWT_REFRESH_TOKEN_EXPIRATION_TIME=<JWT_REFRESH_TOKEN_EXPIRATION_TIME>
JWT_REFRESH_TOKEN_EXPIRATION_TIME=JWT_REFRESH_TOKEN_EXPIRATION_TIME
NEXT_PUBLIC_NX_SERVER_HOST=<NEXT_PUBLIC_NX_SERVER_HOST>
NEXT_PUBLIC_NX_SERVER_PORT=<NEXT_PUBLIC_NX_SERVER_PORT>
NEXT_PUBLIC_PERSIST_ENCRYPTION_SECRET_KEY=<NEXT_PUBLIC_NX_SERVER_PORT>
```

## Migrations

Usage example:

```bash
node umzug.mjs --help

node umzug.mjs up
node umzug.mjs down

node umzug.mjs create --name new-migration-1.cjs
node umzug.mjs create --name new-migration-2.mjs
```

## Authors

- [Powered by Extrawest](https://www.extrawest.com/)

![Logo](https://www.extrawest.com/wp-content/uploads/2017/08/logo-2.png)

## License

[MIT](https://choosealicense.com/licenses/mit/)

