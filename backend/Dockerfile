FROM node:18

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn run build

CMD ["yarn", "start"]
