FROM node:17-buster-slim AS base


WORKDIR /app
COPY package.json ./
RUN npm install -f
COPY . .

RUN chown node:node /app

EXPOSE 80

CMD ["npm", "start"]