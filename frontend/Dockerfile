FROM node:20.13.0-alpine
WORKDIR /usr/frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npx", "vite", "--host", "--mode", "docker"]
