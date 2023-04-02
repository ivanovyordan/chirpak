FROM node:current-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN \
    npm install --include-dev \
    && mv node_modules ../
COPY . .
ENTRYPOINT [ "npm", "start" ]