# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.17.0
FROM node:${NODE_VERSION}-alpine as base

LABEL fly_launch_runtime="NestJS"

RUN apk add dumb-init

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

COPY --link . .

RUN npm run build


FROM base

COPY  --from=build /app /app

EXPOSE 3000

CMD [ "dumb-init", "npm", "run", "start:prod" ]
