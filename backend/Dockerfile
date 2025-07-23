FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production --silent && npm cache clean --force
COPY . .
EXPOSE 5000
CMD ["npm","start"]
