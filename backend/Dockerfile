FROM node:18

WORKDIR /app

# Copy only package.json first so we can use cached yarn install if only the code is changed across versions
COPY package.json /app
COPY yarn.lock /app

RUN yarn install

COPY . /app

RUN yarn run build

CMD ["yarn", "start"]
