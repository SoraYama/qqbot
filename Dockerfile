FROM node:12-alpine

WORKDIR /app

COPY ./package.json ./package.json

RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && apk del tzdata

RUN yarn

COPY . .

CMD ["yarn", "start"]
