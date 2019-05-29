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
ENV INPUT_GEOMETRY POLYGON ((12 42.1, 12.1 42.1, 12.1 41.6, 12 41.6, 12 42.1))
COPY --from=build-stage /app/build /usr/share/nginx/html
ADD inject_input.sh /
ADD nginx/default.conf /etc/nginx/conf.d/
RUN chmod -v +x inject_input.sh
RUN ./inject_input.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]