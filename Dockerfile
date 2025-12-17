FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache yarn
COPY package*.json ./
COPY prisma ./prisma
RUN yarn install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start:prod"]