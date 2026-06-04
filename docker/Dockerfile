FROM node:20-alpine

WORKDIR /app

COPY TP4/package*.json ./

RUN npm install

COPY TP4/ .

EXPOSE 3000

CMD ["node", "server-safe.js"]
