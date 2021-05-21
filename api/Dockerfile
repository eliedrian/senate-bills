FROM node:lts-buster

WORKDIR /app

COPY . /app

RUN npm i && npm run build && rm -rf src package* tsconfig.json

CMD ["node", "build/index.js"]
