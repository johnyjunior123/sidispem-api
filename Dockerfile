# ---------- Build Stage ----------
FROM node:22-bullseye AS build

WORKDIR /app

# Copie arquivos de dependências
COPY package*.json ./

# Instale o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Instale todas as dependências (dev incluídas)
RUN npm install --legacy-peer-deps

# Copie o restante do projeto
COPY . .

# Gere arquivos do Prisma (se estiver usando)
RUN npx prisma generate

# Compile a aplicação
RUN npm run build

# ---------- Production Stage ----------
FROM node:22-bullseye

WORKDIR /app

# Instalar dependências de compilação necessárias para o sharp
RUN apt-get update && apt-get install -y \
    build-essential \
    libvips-dev \
    --fix-missing \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copie apenas os arquivos necessários do build
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copie o build do projeto
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Comando padrão de produção
CMD ["node", "dist/main.js"]
