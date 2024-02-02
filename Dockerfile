FROM node:18.16.0-alpine

WORKDIR /restaurant-server

COPY ./package.json ./yarn.lock ./

RUN yarn install --frozen-lockfile

ENV NODE_ENV=production

EXPOSE 3000

COPY ./dist/apps/restaurant-server ./

CMD ["yarn", "start-prod"]
