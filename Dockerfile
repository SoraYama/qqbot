FROM node:12-alpine

RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && apk del tzdata

WORKDIR /app

COPY ./package.json ./package.json

RUN yarn

COPY . .

CMD ["yarn", "start"]
