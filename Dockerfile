# ---------- Build Stage ----------
# Use Node.js Debian base (mais fácil para Sharp)
FROM node:22-bullseye AS build

# Defina o diretório de trabalho
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

# Copie apenas os arquivos necessários do build
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copie o build do projeto
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Exponha a porta da aplicação
EXPOSE 3000

# Comando padrão de produção
CMD ["node", "dist/main.js"]
