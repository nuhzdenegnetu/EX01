FROM node:lts

WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов проекта
COPY . .

# Установка необходимых переменных среды
ENV JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjkzNzY4MDAwLCJleHAiOjE2OTM3NzE2MDB9.4f5c8b1a2d3e4f5g6h7i8j9k0lmnopqrstuvwx
ENV SESSION_SECRET=d4f8e7c2a9b6f3e1c0d7a5e9f2b4c6a8d1e3f7b9c0a2d4e6f8b1c3a7d9e5f2
ENV PORT=3000
ENV MONGODB_URI=mongodb+srv://venternevertony:Rustam1985@ex01.8zvjqdt.mongodb.net/mydatabase?retryWrites=true&w=majority

# Открытие порта
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "app.mjs"]