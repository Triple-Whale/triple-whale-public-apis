FROM node:18

WORKDIR /

COPY . .

RUN yarn

RUN yarn build

ENV NODE_ENV=production

EXPOSE 8888

CMD [ "yarn", "ts-node", "server.ts" ]