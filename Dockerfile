FROM node:8-alpine

# prepare a user which runs everything locally! - required in child images!
# RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app
WORKDIR $HOME

ENV APP_NAME=electron-updater-demo

# before switching to user we need to set permission properly
# copy all files, except the ignored files from .dockerignore
COPY . $HOME/$APP_NAME/
# RUN chown -R app:app $HOME/*

# RUN npm install -g yarn

# USER app
WORKDIR $HOME/$APP_NAME

# RUN yarn install
RUN npm install
RUN npm run electron:linux

ENTRYPOINT $HOME/$APP_NAME/release/angular-electron.AppImage
