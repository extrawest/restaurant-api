FROM node:18.16.0-alpine

WORKDIR /restaurant-training

COPY ./main.js ./package.json ./yarn.lock ./
COPY ./assets/ ./

RUN yarn install --frozen-lockfile --prod

ENV NODE_ENV=production

EXPOSE 3001

CMD ["yarn", "start-prod"]
