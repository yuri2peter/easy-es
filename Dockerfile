FROM node:14.2.0
MAINTAINER yuri2peter@qq.com
COPY ./src /app/
WORKDIR /app
RUN npm ci
EXPOSE 80
CMD ["npm", "start"]