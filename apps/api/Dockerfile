FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat vips-dev python3 make g++ gcc
WORKDIR /opt/app

COPY package.json ./
RUN npm install --omit=dev

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=1337

EXPOSE 1337
CMD ["npm", "run", "start"]
