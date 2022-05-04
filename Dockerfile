FROM node:16.14.2-alpine
RUN mkdir -p /app 
WORKDIR /app
COPY package.json /usr/src/app/package.json
RUN npm i --production --registry=https://registry.npm.taobao.org
COPY . /app
EXPOSE 7001
CMD npm docker-start