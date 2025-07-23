FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --silent && npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/public /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx","-g","daemon off;"]
