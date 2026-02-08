FROM node:20-alpine

RUN apk add --no-cache tini && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY tsconfig.json ./
COPY . .

RUN chown -R node:node /app

USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npx", "ts-node", "./backend/index.ts"]
