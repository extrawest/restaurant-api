# NxRestaurant

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Development server

Run `nx serve restaurant` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

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
