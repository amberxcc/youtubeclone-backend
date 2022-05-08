FROM node:16.14.2-alpine
RUN mkdir -p /app 
WORKDIR /app
COPY . .
RUN npm i --production --registry=https://registry.npm.taobao.org
EXPOSE 7001
CMD npm start