FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "-r", "dotenv/config", "./dist/bot.ts"]