FROM node:slim

RUN apt-get update 
RUN apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 libgtk-3-0
RUN apt-get -y install software-properties-common