# build stage
FROM node:11.12.0-alpine as build-stage
WORKDIR /app
RUN apk update && apk add python make && rm -rf /var/cache/apk/*
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
ADD nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]