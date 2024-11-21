# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.17.0
FROM node:${NODE_VERSION}-alpine as base

LABEL fly_launch_runtime="NestJS"

RUN apk add dumb-init

WORKDIR /app

ENV NODE_ENV="production"


FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

COPY --chown=node:node --link package-lock.json package.json ./
RUN npm ci --include=dev

COPY --chown=node:node --link . .

RUN npm run build


FROM base

COPY  --chown=node:node --from=build /app /app

USER node

EXPOSE 3000

CMD [ "dumb-init", "npm", "run", "start:prod" ]
