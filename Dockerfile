FROM node:18.16.0-alpine

WORKDIR /app

COPY ./ /app

RUN yarn install --frozen-lockfile --prod

ENV NODE_ENV=production

EXPOSE 3001

CMD ["yarn", "start-prod"]
