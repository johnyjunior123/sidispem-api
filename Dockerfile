# ---------- Build Stage ----------
FROM node:20-bullseye AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate
RUN npm run build


# ---------- Production Stage ----------
FROM node:20-bullseye

WORKDIR /app

# Runtime libs do sharp
RUN apt-get update && apt-get install -y \
    libvips \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# COPIA node_modules PRONTO (sharp OK)
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

CMD ["node", "dist/main.js"]
