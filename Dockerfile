# Виберіть базовий образ
FROM node:18 AS build

# Встановіть робочий каталог
WORKDIR /app

# Скопіюйте package.json і package-lock.json
COPY package*.json ./

# Встановіть залежності
RUN npm install

# Скопіюйте весь код
COPY . .

# Побудуйте проект
RUN npm run build

# Виберіть образ для продакшн
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
# Скопіюйте побудовані файли в каталог для сервера
COPY --from=build /app/dist /usr/share/nginx/html

# Відкрийте порт для сервера
EXPOSE 80

# Запустіть Nginx
CMD ["nginx", "-g", "daemon off;"]