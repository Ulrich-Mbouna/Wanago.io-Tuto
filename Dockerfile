FROM node:20-alpine as development

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./


RUN npm install

COPY ./src ./src

COPY nest-cli.json ./

RUN npm run build

CMD ["npm","run","start:dev"]

