FROM node:alpine
WORKDIR /app
COPY package.json /build/ /app/
RUN npm install
RUN npm i -g nodemon
CMD [ "nodemon", "./build/index.js" ]