# Use uma imagem base Node.js
FROM node:22-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json
COPY package*.json ./

# Instale o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Instale as dependências do projeto
RUN npm install --production=false

# Copie o restante dos arquivos do projeto para o contêiner
COPY . .

# Gere as configurações do Prisma (caso use Prisma)
RUN npx prisma generate

# Realize o build da aplicação
RUN npm run build

# Exponha a porta da aplicação (3000)
EXPOSE 3000

# Defina o comando para rodar a aplicação em produção
CMD ["node", "dist/main.js"]
