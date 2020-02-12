FROM node:8.11.0
RUN apt-get update
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV PATH /app/packages/server/node_modules/.bin:$PATH
ENV PATH /app/packages/land-cc/node_modules/.bin:$PATH
COPY . /app
RUN npm install
RUN npm run install
RUN npm install -g nodemon
RUN useradd -m rs
# RUN chown -R rs /config
USER rs
EXPOSE 8000
CMD [ "nodemon", "start" ]