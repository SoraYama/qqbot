FROM node:12-alpine

RUN sed -i 's#http://dl-cdn.alpinelinux.org#https://mirrors.ustc.edu.cn#g' /etc/apk/repositories

RUN apk add --no-cache tzdata

ENV TZ Asia/Shangha

WORKDIR /app

COPY ./package.json ./package.json

RUN yarn

COPY . .

CMD ["yarn", "start"]
