FROM node:20.13.0-alpine
WORKDIR /usr/backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npx tsc
CMD ["node", "dist/server.js"]