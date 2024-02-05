FROM node:18.16.0-alpine

WORKDIR /restaurant-server

# COPY ./package.json ./yarn.lock ./
COPY . ./

RUN yarn install --frozen-lockfile --prod

ENV NODE_ENV=production

EXPOSE 3001

# COPY ./dist/apps/restaurant-server ./

CMD ["yarn", "start-prod"]
